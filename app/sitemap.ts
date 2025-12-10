import type { MetadataRoute } from "next"

const baseUrl = "https://drghahary.com"

const sitemapPaths = ["/", "/privacy", "/terms", "/admin/analytics", "/admin/seo", "/admin/content"]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return sitemapPaths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified,
  }))
}
