# danohn.com Hugo Starter

Minimal Hugo starter for a personal engineering blog: essays, tutorials, and research notes.

## Run Locally

```bash
cd danohn.com
hugo server
```

Open:

```text
http://localhost:1313/
```

## Build Static Files

```bash
cd danohn.com
hugo
```

The generated site is written to `public/`.

## Key Files

- `hugo.toml`: site config, menus, taxonomies, RSS/JSON outputs.
- `layouts/index.html`: home page with intro, latest post, and post list.
- `layouts/_default/single.html`: article page template.
- `layouts/_default/list.html`: topic listing template.
- `layouts/partials/`: shared header, search, footer, and head partials.
- `assets/css/main.css`: visual system, responsive layout, light/dark tokens.
- `static/js/site.js`: theme toggle, topic filtering, and search overlay.
- `content/posts/`: sample Markdown posts.

## Add A Post

Create a Markdown file in `content/posts/`:

```md
---
title: "My new post"
description: "One sentence summary for lists and metadata."
date: 2026-06-05
topics: ["systems"]
---

Your post starts here.
```

Use `topics` for the main subjects readers browse by.

You can also create a pre-filled post with:

```bash
hugo new content/posts/my-new-post.md
```

## SEO Fields

Use `description` for the search/social preview summary. Use `summary` only when you want a different short excerpt for internal search.

Optional fields:

```md
canonical: "https://example.com/original-url/"
image: "/images/social/my-post.png"
lastmod: 2026-06-05
```

If `canonical` is empty, Hugo uses the page's own permalink. If `image` is set, the Open Graph and Twitter card tags use it.

## Analytics

Production builds load the self-hosted Plausible script from `https://analytics.danohn.com`. Local development builds do not load analytics.

The Plausible host and tracked domain are configured under `[params.analytics]` in `hugo.toml`.
