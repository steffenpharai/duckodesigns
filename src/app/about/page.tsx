import { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"
import { aboutContent } from "@/content/about"
import { siteConfig } from "@/config/site"

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Ducko Designs - a family-owned business creating custom toddler clothing & accessories.",
  openGraph: {
    title: "About | Ducko Designs",
    description: "Learn about Ducko Designs - a family-owned business creating custom toddler clothing & accessories.",
  },
}

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.name,
    description: siteConfig.description,
    email: siteConfig.contact.email,
    url: siteConfig.url,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container py-12 max-w-4xl">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">{aboutContent.title}</h1>
          </div>

          <div className="space-y-8">
            {aboutContent.sections.map((section, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-semibold mb-4">
                    {section.heading}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {section.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
              <p className="text-muted-foreground mb-4">
                Have questions or want to learn more? We&apos;d love to hear from you!
              </p>
              <div className="space-y-2">
                <p>
                  <strong>Email:</strong>{" "}
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="text-primary hover:underline"
                  >
                    {siteConfig.contact.email}
                  </a>
                </p>
                <p>
                  <strong>Social Media:</strong> Follow us on{" "}
                  <a
                    href={siteConfig.links.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Facebook
                  </a>{" "}
                  and{" "}
                  <a
                    href={siteConfig.links.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Instagram
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

