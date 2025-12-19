import { MetadataRoute } from "next"
import { getAllProducts } from "@/lib/products"
import { siteConfig } from "@/config/site"

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url

  const routes = [
    "",
    "/shop",
    "/custom-order",
    "/about",
    "/contact",
    "/policies/shipping",
    "/policies/returns",
    "/policies/privacy",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }))

  try {
    const products = await getAllProducts()
    const productRoutes = products.map((product) => ({
      url: `${baseUrl}/product/${product.id}`,
      lastModified: product.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))

    return [...routes, ...productRoutes]
  } catch (error) {
    console.error('Failed to fetch products for sitemap:', error)
    return routes
  }
}

