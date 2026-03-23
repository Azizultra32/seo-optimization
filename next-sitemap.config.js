/** @type {import('next-sitemap').IConfig} */
const sitemapConfig = {
  siteUrl: process.env.SITE_URL || "https://drghahary.com",
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ["/admin/*", "/api/*"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    additionalSitemaps: [],
  },
  transform: async (config, path) => {
    const priorities = { "/": 1, "/privacy": 0.3, "/terms": 0.3 }
    const freqs = { "/": "weekly", "/privacy": "monthly", "/terms": "monthly" }
    return {
      loc: path,
      changefreq: freqs[path] || "weekly",
      priority: priorities[path] || 0.7,
      lastmod: new Date().toISOString(),
    }
  },
}

module.exports = sitemapConfig
