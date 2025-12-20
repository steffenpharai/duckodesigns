"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MultiImageUpload } from "@/components/MultiImageUpload"
import { ProductCategory } from "@prisma/client"

export default function NewProductPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "" as ProductCategory | "",
    images: [] as string[],
    tags: [] as string[],
    fabricOptions: [] as string[],
    sizes: [] as string[],
    featured: false,
    customizable: true,
    turnaround: "",
    isCarSeatFriendly: null as boolean | null,
    initialQuantity: "0",
    lowStockThreshold: "5",
  })

  const [tagInput, setTagInput] = useState("")
  const [fabricInput, setFabricInput] = useState("")
  const [sizeInput, setSizeInput] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Create product first (without images)
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          price: parseFloat(formData.price),
          description: formData.description,
          category: formData.category,
          images: [], // Will be updated after upload
          tags: formData.tags,
          fabricOptions: formData.fabricOptions,
          sizes: formData.sizes,
          featured: formData.featured,
          customizable: formData.customizable,
          turnaround: formData.turnaround,
          isCarSeatFriendly: formData.isCarSeatFriendly,
          initialQuantity: parseInt(formData.initialQuantity) || 0,
          lowStockThreshold: parseInt(formData.lowStockThreshold) || 5,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create product")
      }

      const { product } = await response.json()

      // Upload images and update product
      if (formData.images.length > 0) {
        const imageUrls: string[] = []
        for (let i = 0; i < formData.images.length; i++) {
          const base64Image = formData.images[i]
          if (base64Image.startsWith("data:image/")) {
            // Upload to Cloud Storage
            const fileName = `product-image-${i + 1}.jpg`
            const uploadResponse = await fetch("/api/products/images", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                base64Data: base64Image,
                productId: product.id,
                fileName,
              }),
            })

            if (!uploadResponse.ok) {
              throw new Error("Failed to upload image")
            }

            const { imageUrl } = await uploadResponse.json()
            imageUrls.push(imageUrl)
          } else {
            // Already a URL
            imageUrls.push(base64Image)
          }
        }

        // Update product with image URLs
        const updateResponse = await fetch(`/api/products/${product.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ images: imageUrls }),
        })

        if (!updateResponse.ok) {
          throw new Error("Failed to update product with images")
        }
      }

      router.push("/admin/products")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      })
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    })
  }

  const addFabric = () => {
    if (fabricInput.trim() && !formData.fabricOptions.includes(fabricInput.trim())) {
      setFormData({
        ...formData,
        fabricOptions: [...formData.fabricOptions, fabricInput.trim()],
      })
      setFabricInput("")
    }
  }

  const removeFabric = (fabric: string) => {
    setFormData({
      ...formData,
      fabricOptions: formData.fabricOptions.filter((f) => f !== fabric),
    })
  }

  const addSize = () => {
    if (sizeInput.trim() && !formData.sizes.includes(sizeInput.trim())) {
      setFormData({
        ...formData,
        sizes: [...formData.sizes, sizeInput.trim()],
      })
      setSizeInput("")
    }
  }

  const removeSize = (size: string) => {
    setFormData({
      ...formData,
      sizes: formData.sizes.filter((s) => s !== size),
    })
  }

  return (
    <div className="container py-12 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold">Create New Product</h1>
          <p className="text-muted-foreground mt-2">
            Add a new product to your catalog
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (USD) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value as ProductCategory })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(ProductCategory).map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="turnaround">Turnaround Time *</Label>
                <Input
                  id="turnaround"
                  value={formData.turnaround}
                  onChange={(e) => setFormData({ ...formData, turnaround: e.target.value })}
                  placeholder="e.g., 1-2 weeks"
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
            </CardHeader>
            <CardContent>
              <MultiImageUpload
                images={formData.images}
                onImagesChange={(images) => setFormData({ ...formData, images })}
                maxImages={10}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Options & Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addTag()
                      }
                    }}
                    placeholder="Add a tag"
                  />
                  <Button type="button" onClick={addTag}>
                    Add
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-muted rounded-md text-sm flex items-center gap-2"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Fabric Options</Label>
                <div className="flex gap-2">
                  <Input
                    value={fabricInput}
                    onChange={(e) => setFabricInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addFabric()
                      }
                    }}
                    placeholder="Add a fabric option"
                  />
                  <Button type="button" onClick={addFabric}>
                    Add
                  </Button>
                </div>
                {formData.fabricOptions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.fabricOptions.map((fabric) => (
                      <span
                        key={fabric}
                        className="px-2 py-1 bg-muted rounded-md text-sm flex items-center gap-2"
                      >
                        {fabric}
                        <button
                          type="button"
                          onClick={() => removeFabric(fabric)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Sizes</Label>
                <div className="flex gap-2">
                  <Input
                    value={sizeInput}
                    onChange={(e) => setSizeInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addSize()
                      }
                    }}
                    placeholder="Add a size"
                  />
                  <Button type="button" onClick={addSize}>
                    Add
                  </Button>
                </div>
                {formData.sizes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.sizes.map((size) => (
                      <span
                        key={size}
                        className="px-2 py-1 bg-muted rounded-md text-sm flex items-center gap-2"
                      >
                        {size}
                        <button
                          type="button"
                          onClick={() => removeSize(size)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="featured">Featured Product</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="customizable"
                  checked={formData.customizable}
                  onChange={(e) => setFormData({ ...formData, customizable: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="customizable">Customizable</Label>
              </div>

              {formData.category === ProductCategory.poncho && (
                <div className="space-y-2">
                  <Label>Car Seat Friendly</Label>
                  <Select
                    value={formData.isCarSeatFriendly === null ? "null" : formData.isCarSeatFriendly ? "true" : "false"}
                    onValueChange={(value) => {
                      setFormData({
                        ...formData,
                        isCarSeatFriendly: value === "null" ? null : value === "true",
                      })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="null">Not Applicable</SelectItem>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="initialQuantity">Initial Quantity</Label>
                  <Input
                    id="initialQuantity"
                    type="number"
                    min="0"
                    value={formData.initialQuantity}
                    onChange={(e) => setFormData({ ...formData, initialQuantity: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                  <Input
                    id="lowStockThreshold"
                    type="number"
                    min="0"
                    value={formData.lowStockThreshold}
                    onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Product"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/products")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

