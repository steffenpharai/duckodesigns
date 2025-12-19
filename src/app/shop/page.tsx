import { Metadata } from "next"
import { ProductCard } from "@/components/ProductCard"
import { products } from "@/data/products"
import { siteConfig } from "@/config/site"

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse our collection of custom car seat-friendly ponchos for toddlers.",
  openGraph: {
    title: "Shop | Ducko Designs",
    description: "Browse our collection of custom car seat-friendly ponchos for toddlers.",
  },
}

export default function ShopPage() {
  return (
    <div className="container py-12">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Shop All Products</h1>
          <p className="text-muted-foreground text-lg">
            Browse our collection of custom car seat-friendly ponchos
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}

