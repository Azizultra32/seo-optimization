# Website repair source map

This branch starts at the verified live production commit fb9bf81bf39c848edeb7c73f5699b8c7ac694c82.

- `app/layout.tsx` - primary-domain metadata, structured identity and social-preview references.
- `app/opengraph-image.tsx` - self-contained sharing image, requiring no external asset fetch.
- `app/privacy/page.tsx`, `app/terms/page.tsx` - page-specific canonicals and existing policy text with corrected site name; substantive legal accuracy has not been certified.
- `components/home-page.tsx` - existing production homepage, with its broken /legal footer item removed.
- `public/robots.txt`, `public/sitemap.xml` - crawl guidance and the three existing public page URLs.

Build evidence, deployment boundaries and current status are maintained in ../CURRENT.md. APIs, database scripts, automation schedules and dependencies are inherited unchanged from production; they are outside this metadata repair.
