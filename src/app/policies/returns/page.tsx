import { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"
import { returnsPolicy } from "@/content/policies"

export const metadata: Metadata = {
  title: "Returns & Exchanges",
  description: "Information about returns, exchanges, and refunds for Ducko Designs orders.",
}

export default function ReturnsPolicyPage() {
  return (
    <div className="container py-12 max-w-4xl">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold">{returnsPolicy.title}</h1>
        <Card>
          <CardContent className="pt-6">
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: returnsPolicy.content }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

