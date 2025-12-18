/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://drghahary.com",
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  
  // Exclude admin and API routes
  exclude: ["/admin/*", "/api/*"],
  
  // Custom robots.txt policies
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
  
  // Transform function to customize sitemap entries
  transform: async (config, path) => {
    // Custom priority based on path
    let priority = 0.7
    let changefreq = "weekly"
    
    if (path === "/") {
      priority = 1.0
      changefreq = "weekly"
    } else if (path === "/privacy" || path === "/terms") {
      priority = 0.3
      changefreq = "monthly"
    }
    
    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    }
  },
}
