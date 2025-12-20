import { getAllProducts } from "@/lib/products"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { ProductsListClient } from "@/components/admin/ProductsListClient"

export default async function AdminProductsPage() {
  const products = await getAllProducts()

  return (
    <div className="container py-12">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Products</h1>
            <p className="text-muted-foreground mt-2">
              Manage your product catalog
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/products/new">Add Product</Link>
          </Button>
        </div>

        <ProductsListClient initialProducts={products} />
      </div>
    </div>
  )
}
