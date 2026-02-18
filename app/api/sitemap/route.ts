export async function GET() {
  const baseUrl = process.env.SITE_URL || "https://drghahary.com"

  const urls = [
    { loc: "/", lastmod: "2024-12-17", changefreq: "weekly", pri: "1.0" },
    { loc: "/privacy", lastmod: "2024-12-17", changefreq: "monthly", pri: "0.3" },
    { loc: "/terms", lastmod: "2024-12-17", changefreq: "monthly", pri: "0.3" },
    { loc: "/legal", lastmod: "2024-12-17", changefreq: "monthly", pri: "0.3" },
  ]

  const entries = urls
    .map(
      (u) =>
        `  <url>\n    <loc>${baseUrl}${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <pri` +
        `ority>${u.pri}</pri` +
        `ority>\n  </url>`
    )
    .join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  })
}
