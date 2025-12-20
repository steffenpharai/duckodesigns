"use client"

import { useState, useMemo, useEffect } from "react"
import { ProductCard } from "@/components/ProductCard"
import { ProductCategory } from "@/lib/products"
import { Product } from "@prisma/client"
import { Button } from "@/components/ui/button"

const categories: ProductCategory[] = ["poncho", "pajamas", "pants", "shirt", "booties", "gloves", "set", "accessory", "other"]

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "all">("all")
  const [showCarSeatFriendlyOnly, setShowCarSeatFriendlyOnly] = useState(false)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products')
        const data = await response.json()
        setProducts(data.products || [])
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const filteredProducts = useMemo(() => {
    let filtered = products

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    // Filter by car-seat friendly (only applies when viewing all or ponchos)
    if (showCarSeatFriendlyOnly) {
      if (selectedCategory === "all" || selectedCategory === "poncho") {
        filtered = filtered.filter((product) => product.isCarSeatFriendly === true)
      } else {
        // If not viewing all or ponchos, this filter doesn't apply
        filtered = []
      }
    }

    return filtered
  }, [products, selectedCategory, showCarSeatFriendlyOnly])

  return (
    <div className="container py-8 md:py-12">
      <div className="space-y-6 md:space-y-8">
        <div className="text-center space-y-3 md:space-y-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Shop All Products</h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
            Browse our collection of custom toddler clothing & accessories
          </p>
        </div>

        {/* Filters */}
        <div className="space-y-3 md:space-y-4">
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 md:pb-0">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
              className="min-h-[44px] min-w-[60px]"
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize min-h-[44px] whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
          
          {(selectedCategory === "all" || selectedCategory === "poncho") && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="carSeatFriendly"
                checked={showCarSeatFriendlyOnly}
                onChange={(e) => setShowCarSeatFriendlyOnly(e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 cursor-pointer"
              />
              <label htmlFor="carSeatFriendly" className="text-sm sm:text-base font-medium cursor-pointer min-h-[44px] flex items-center">
                Car-seat friendly only
              </label>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-sm sm:text-base text-muted-foreground">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm sm:text-base text-muted-foreground">No products found matching your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

