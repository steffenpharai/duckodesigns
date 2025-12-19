import { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"
import { privacyPolicy } from "@/content/policies"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Ducko Designs - how we collect, use, and protect your information.",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="container py-12 max-w-4xl">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold">{privacyPolicy.title}</h1>
        <Card>
          <CardContent className="pt-6">
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: privacyPolicy.content }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

