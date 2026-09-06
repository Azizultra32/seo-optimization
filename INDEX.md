# Website search metadata integration

This branch integrates the reviewed search metadata fixes into main at 10eb8e68deb3696c0fbcab8d3a8b5185fb8995f5. The separate production-based release candidate is 3d8bf6d241de18e0204d8d866215471c866eb7a4; this integration does not approve publishing other main changes.

- `app/layout.tsx` - primary-domain canonicals, structured identity and sharing-image references.
- `app/opengraph-image.tsx` - self-contained 1200 by 630 sharing image.
- `app/privacy/page.tsx`, `app/terms/page.tsx` - page-specific search and sharing metadata; existing policy bodies are preserved.
- `public/robots.txt`, `public/sitemap.xml` - crawl guidance and main's four existing public page URLs.
- `next-sitemap.config.js` - sitemap generator fallback uses the same primary domain.

The current main UI, valid Legal route and footer link, APIs, database scripts, automation schedules, and dependencies are preserved. Build and integration status are maintained in the containing capsule's CURRENT.md.
