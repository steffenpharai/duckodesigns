"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUpload } from "@/components/ImageUpload"
import { CheckCircle2 } from "lucide-react"
import { getProductById } from "@/data/products"
import { siteConfig } from "@/config/site"

function CustomOrderForm() {
  const searchParams = useSearchParams()
  const productId = searchParams.get("product")
  const product = productId ? getProductById(productId) : null

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    childSize: "",
    productType: product?.name || "",
    fabricPreference: "",
    personalization: "",
    deadline: "",
  })
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const payload = {
        ...formData,
        imageBase64,
        productId: product?.id || null,
        timestamp: new Date().toISOString(),
      }

      const response = await fetch("/api/custom-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        setIsSuccess(true)
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          childSize: "",
          productType: "",
          fabricPreference: "",
          personalization: "",
          deadline: "",
        })
        setImageBase64(null)
      } else {
        alert("There was an error submitting your order. Please try again.")
      }
    } catch (error) {
      console.error("Error submitting order:", error)
      alert("There was an error submitting your order. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="container py-12 max-w-2xl">
        <Card>
          <CardContent className="pt-6 text-center space-y-4">
            <CheckCircle2 className="h-16 w-16 text-primary mx-auto" />
            <h2 className="text-2xl font-bold">Order Request Received!</h2>
            <p className="text-muted-foreground">
              Thank you for your order request. We&apos;ve received your information 
              and will contact you shortly to discuss your custom poncho details.
            </p>
            <Button asChild>
              <a href="/shop">Continue Shopping</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-12 max-w-2xl">
      <div className="space-y-6 mb-8">
        <h1 className="text-4xl font-bold">Custom Order Request</h1>
        <p className="text-muted-foreground">
          Fill out the form below to request a custom poncho. We&apos;ll contact you 
          to discuss details, pricing, and timeline.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="childSize">Child Size *</Label>
              <Select
                value={formData.childSize}
                onValueChange={(value) => handleSelectChange("childSize", value)}
                required
              >
                <SelectTrigger id="childSize">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12-18 months">12-18 months</SelectItem>
                  <SelectItem value="18-24 months">18-24 months</SelectItem>
                  <SelectItem value="2T">2T</SelectItem>
                  <SelectItem value="3T">3T</SelectItem>
                  <SelectItem value="4T">4T</SelectItem>
                  <SelectItem value="other">Other (specify in notes)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="productType">Product Type</Label>
              <Input
                id="productType"
                name="productType"
                type="text"
                value={formData.productType}
                onChange={handleChange}
                placeholder="e.g., Classic Car Seat Poncho"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fabricPreference">Fabric Preference Notes</Label>
              <Textarea
                id="fabricPreference"
                name="fabricPreference"
                value={formData.fabricPreference}
                onChange={handleChange}
                placeholder="Tell us about your fabric preferences, colors, patterns, etc."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="personalization">Personalization Details</Label>
              <Textarea
                id="personalization"
                name="personalization"
                value={formData.personalization}
                onChange={handleChange}
                placeholder="Any special requests, embroidery, or customization ideas?"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Needed By (Optional)</Label>
              <Input
                id="deadline"
                name="deadline"
                type="date"
                value={formData.deadline}
                onChange={handleChange}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reference Image (Optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUpload
              onImageChange={setImageBase64}
              currentImage={imageBase64}
            />
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Order Request"}
        </Button>
      </form>
    </div>
  )
}

export default function CustomOrderPage() {
  return (
    <Suspense fallback={<div className="container py-12">Loading...</div>}>
      <CustomOrderForm />
    </Suspense>
  )
}

