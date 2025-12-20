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
  const typeParam = searchParams.get("type")
  const product = productId ? getProductById(productId) : null

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    childSize: "",
    productType: (typeParam || product?.category || "") as string,
    fabricPreference: "",
    personalization: "",
    deadline: "",
    carSeatFriendlyRequested: false,
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
      // Reset car-seat friendly if product type changes away from poncho
      ...(name === "productType" && value !== "poncho" ? { carSeatFriendlyRequested: false } : {}),
    }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
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
          carSeatFriendlyRequested: false,
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
      <div className="container py-8 md:py-12 max-w-2xl">
        <Card>
          <CardContent className="pt-4 md:pt-6 text-center space-y-4">
            <CheckCircle2 className="h-12 w-12 sm:h-16 sm:w-16 text-primary mx-auto" />
            <h2 className="text-xl sm:text-2xl font-bold">Order Request Received!</h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Thank you for your order request. We&apos;ve received your information 
              and will contact you shortly to discuss your custom order details.
            </p>
            <Button asChild className="min-h-[44px]">
              <a href="/shop">Continue Shopping</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-8 md:py-12 max-w-2xl">
      <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Custom Order Request</h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Fill out the form below to request custom toddler clothing. We&apos;ll contact you 
          to discuss details, pricing, and timeline.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 md:space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm sm:text-base">Name *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="min-h-[44px] text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm sm:text-base">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="min-h-[44px] text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm sm:text-base">Phone (Optional)</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="min-h-[44px] text-base"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 md:space-y-4">
            <div className="space-y-2">
              <Label htmlFor="childSize" className="text-sm sm:text-base">Child Size *</Label>
              <Select
                value={formData.childSize}
                onValueChange={(value) => handleSelectChange("childSize", value)}
                required
              >
                <SelectTrigger id="childSize" className="min-h-[44px] text-base">
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
              <Label htmlFor="productType" className="text-sm sm:text-base">Product Type *</Label>
              <Select
                value={formData.productType}
                onValueChange={(value) => handleSelectChange("productType", value)}
                required
              >
                <SelectTrigger id="productType" className="min-h-[44px] text-base">
                  <SelectValue placeholder="Select product type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="poncho">Poncho</SelectItem>
                  <SelectItem value="pajamas">Pajamas</SelectItem>
                  <SelectItem value="pants">Pants</SelectItem>
                  <SelectItem value="shirt">Shirt</SelectItem>
                  <SelectItem value="booties">Booties</SelectItem>
                  <SelectItem value="gloves">Gloves</SelectItem>
                  <SelectItem value="set">Set</SelectItem>
                  <SelectItem value="accessory">Accessory</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.productType === "poncho" && (
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="carSeatFriendlyRequested"
                    checked={formData.carSeatFriendlyRequested}
                    onChange={(e) => handleCheckboxChange("carSeatFriendlyRequested", e.target.checked)}
                    className="mt-1 h-5 w-5 rounded border-gray-300 cursor-pointer flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <Label htmlFor="carSeatFriendlyRequested" className="cursor-pointer text-sm sm:text-base block min-h-[44px] flex items-center">
                      Request car-seat strap friendly style
                    </Label>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                      Our car-seat friendly ponchos are designed so that car seat straps can go underneath, allowing for proper strap placement. This design feature may help address concerns about bulky outerwear interfering with car seat straps.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="fabricPreference" className="text-sm sm:text-base">Fabric Preference Notes</Label>
              <Textarea
                id="fabricPreference"
                name="fabricPreference"
                value={formData.fabricPreference}
                onChange={handleChange}
                placeholder="Tell us about your fabric preferences, colors, patterns, etc."
                rows={4}
                className="text-base resize-y min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="personalization" className="text-sm sm:text-base">Personalization Details</Label>
              <Textarea
                id="personalization"
                name="personalization"
                value={formData.personalization}
                onChange={handleChange}
                placeholder="Any special requests, embroidery, or customization ideas?"
                rows={4}
                className="text-base resize-y min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline" className="text-sm sm:text-base">Needed By (Optional)</Label>
              <Input
                id="deadline"
                name="deadline"
                type="date"
                value={formData.deadline}
                onChange={handleChange}
                className="min-h-[44px] text-base"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Reference Image (Optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUpload
              onImageChange={setImageBase64}
              currentImage={imageBase64}
            />
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full min-h-[44px]" disabled={isSubmitting}>
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

