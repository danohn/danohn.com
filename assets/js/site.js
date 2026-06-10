(function () {
  const root = document.documentElement;
  const colorScheme = window.matchMedia("(prefers-color-scheme: dark)");
  const themeToggle = document.querySelector("[data-theme-toggle]");

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.append(textarea);
      textarea.select();
      const copied = document.execCommand("copy");
      textarea.remove();
      return copied;
    }
  }

  function updateThemeToggle() {
    const isDark = root.dataset.theme === "dark";
    themeToggle?.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  }

  function updateGiscusTheme() {
    const iframe = document.querySelector("iframe.giscus-frame");
    if (!iframe?.dataset.giscusReady) return;
    iframe?.contentWindow?.postMessage({
      giscus: {
        setConfig: {
          theme: root.dataset.theme === "dark" ? "transparent_dark" : "light",
        },
      },
    }, "https://giscus.app");
  }

  updateThemeToggle();
  themeToggle?.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    localStorage.setItem("theme", next);
    updateThemeToggle();
    updateGiscusTheme();
  });

  colorScheme.addEventListener("change", (event) => {
    if (localStorage.getItem("theme")) return;
    root.dataset.theme = event.matches ? "dark" : "light";
    updateThemeToggle();
    updateGiscusTheme();
  });

  const comments = document.querySelector(".comments");
  if (comments) {
    function connectGiscusTheme() {
      const iframe = comments.querySelector("iframe.giscus-frame");
      if (!iframe) return false;
      iframe.addEventListener("load", () => {
        iframe.dataset.giscusReady = "true";
        updateGiscusTheme();
      }, { once: true });
      return true;
    }

    if (!connectGiscusTheme()) {
      const observer = new MutationObserver(() => {
        if (!connectGiscusTheme()) return;
        observer.disconnect();
      });
      observer.observe(comments, { childList: true, subtree: true });
    }
  }

  const share = document.querySelector("[data-share]");
  if (share) {
    const shareTitle = share.dataset.shareTitle;
    const shareUrl = share.dataset.shareUrl;
    const nativeShare = share.querySelector("[data-share-native]");
    const copyShare = share.querySelector("[data-share-copy]");
    const shareStatus = share.querySelector("[data-share-status]");

    if (navigator.share && nativeShare) {
      nativeShare.hidden = false;
      nativeShare.addEventListener("click", async () => {
        try {
          await navigator.share({ title: shareTitle, url: shareUrl });
        } catch (error) {
          if (error.name !== "AbortError" && shareStatus) shareStatus.textContent = "Unable to share.";
        }
      });
    }

    copyShare?.addEventListener("click", async () => {
      const copied = await copyText(shareUrl);
      if (shareStatus) shareStatus.textContent = copied ? "Link copied." : "Unable to copy link.";
    });
  }

  document.querySelectorAll("[data-code-block]").forEach((block) => {
    const button = block.querySelector("[data-code-copy]");
    const code = block.querySelector("code");
    if (!button || !code) return;
    const copyLabel = button.getAttribute("aria-label");

    button.addEventListener("click", async () => {
      const copied = await copyText(code.textContent);
      if (copied) {
        button.textContent = "Copied";
        button.setAttribute("aria-label", "Code copied");
      } else {
        button.textContent = "Unable to copy";
      }
      window.setTimeout(() => {
        button.textContent = "Copy";
        button.setAttribute("aria-label", copyLabel);
      }, 1600);
    });
  });

  const overlay = document.querySelector("[data-search-overlay]");
  const searchPanel = overlay?.querySelector('[role="dialog"]');
  const openSearch = document.querySelectorAll("[data-search-open]");
  const closeSearch = document.querySelector("[data-search-close]");
  const searchInput = document.querySelector("[data-search-input]");
  const results = document.querySelector("[data-search-results]");
  let posts = [];
  let searchIndexPromise;
  let focusBeforeSearch;

  function clearSearchResults() {
    results?.replaceChildren();
  }

  function renderSearchMessage(message) {
    if (!results) return;
    const paragraph = document.createElement("p");
    paragraph.className = "search-result";
    paragraph.textContent = message;
    results.replaceChildren(paragraph);
  }

  function loadSearchIndex() {
    if (!searchIndexPromise) {
      searchIndexPromise = fetch(overlay?.dataset.searchIndexUrl || "/index.json")
        .then((response) => {
          if (!response.ok) throw new Error("Search index unavailable");
          return response.json();
        })
        .then((data) => {
          posts = data;
        })
        .catch(() => {
          posts = [];
        });
    }
    return searchIndexPromise;
  }

  async function openPanel() {
    if (!overlay || !searchInput) return;
    focusBeforeSearch = document.activeElement;
    searchInput.value = "";
    clearSearchResults();
    overlay.hidden = false;
    searchInput.focus();
    await loadSearchIndex();
  }

  function closePanel() {
    if (!overlay || overlay.hidden) return;
    overlay.hidden = true;
    if (searchInput) searchInput.value = "";
    clearSearchResults();
    focusBeforeSearch?.focus?.();
    focusBeforeSearch = null;
  }

  function renderResults(query) {
    if (!results) return;
    const q = query.trim().toLowerCase();
    if (q.length < 3) {
      clearSearchResults();
      return;
    }

    const matches = posts
      .filter((post) => `${post.title} ${post.summary} ${post.content || ""} ${(post.topics || []).join(" ")}`.toLowerCase().includes(q))
      .slice(0, 6);

    if (!matches.length) {
      renderSearchMessage("No matching posts yet.");
      return;
    }

    const fragment = document.createDocumentFragment();
    matches.forEach((post) => {
      const link = document.createElement("a");
      const title = document.createElement("strong");
      const summary = document.createElement("p");

      link.className = "search-result";
      link.href = post.url;
      title.textContent = post.title;
      summary.textContent = post.summary || (post.topics || []).join(", ");
      link.append(title, summary);
      fragment.append(link);
    });
    results.replaceChildren(fragment);
  }

  async function handleSearchInput(event) {
    await loadSearchIndex();
    renderResults(event.target.value);
  }

  openSearch.forEach((button) => button.addEventListener("click", openPanel));
  closeSearch?.addEventListener("click", closePanel);
  searchInput?.addEventListener("input", handleSearchInput);
  overlay?.addEventListener("click", (event) => {
    if (event.target === overlay) closePanel();
  });
  document.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      openPanel();
    }
    if (event.key === "Escape" && overlay && !overlay.hidden) closePanel();
    if (event.key === "Tab" && overlay && !overlay.hidden && searchPanel) {
      const focusable = Array.from(searchPanel.querySelectorAll('a[href], button, input'))
        .filter((element) => !element.disabled && element.getClientRects().length);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
  });
})();
