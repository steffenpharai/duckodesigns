import { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"
import { shippingPolicy } from "@/content/policies"

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: "Information about shipping, processing times, and delivery for Ducko Designs orders.",
}

export default function ShippingPolicyPage() {
  return (
    <div className="container py-12 max-w-4xl">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold">{shippingPolicy.title}</h1>
        <Card>
          <CardContent className="pt-6">
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: shippingPolicy.content }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

