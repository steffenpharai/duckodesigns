"use client"

import { useState, useMemo } from "react"
import { ProductCard } from "@/components/ProductCard"
import { products, ProductCategory } from "@/data/products"
import { Button } from "@/components/ui/button"

const categories: ProductCategory[] = ["poncho", "pajamas", "pants", "shirt", "booties", "gloves", "set", "accessory", "other"]

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "all">("all")
  const [showCarSeatFriendlyOnly, setShowCarSeatFriendlyOnly] = useState(false)

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
  }, [selectedCategory, showCarSeatFriendlyOnly])

  return (
    <div className="container py-12">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Shop All Products</h1>
          <p className="text-muted-foreground text-lg">
            Browse our collection of custom toddler clothing & accessories
          </p>
        </div>

        {/* Filters */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
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
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="carSeatFriendly" className="text-sm font-medium cursor-pointer">
                Car-seat friendly only
              </label>
            </div>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found matching your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

