(function () {
  const root = document.documentElement;

  const themeToggle = document.querySelector("[data-theme-toggle]");
  function updateThemeToggle() {
    const isDark = root.dataset.theme === "dark";
    themeToggle?.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  }

  updateThemeToggle();
  themeToggle?.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    localStorage.setItem("theme", next);
    updateThemeToggle();
  });

  const overlay = document.querySelector("[data-search-overlay]");
  const searchPanel = overlay?.querySelector('[role="dialog"]');
  const openSearch = document.querySelector("[data-search-open]");
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
      renderSearchMessage("No matching notes yet.");
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

  openSearch?.addEventListener("click", openPanel);
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
