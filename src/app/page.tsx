import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ProductCard } from "@/components/ProductCard"
import { TrustBadges } from "@/components/TrustBadges"
import { FAQAccordion } from "@/components/FAQAccordion"
import { HowItWorks } from "@/components/HowItWorks"
import { SocialButtons } from "@/components/SocialButtons"
import { CarSeatDisclaimer } from "@/components/CarSeatDisclaimer"
import { getFeaturedProducts } from "@/data/products"
import { faqs } from "@/content/faq"
import { siteConfig } from "@/config/site"

export default function HomePage() {
  const featuredProducts = getFeaturedProducts()

  const testimonials = [
    {
      name: "Sarah M.",
      text: "These ponchos are a game-changer! My daughter stays warm in the car, and I have peace of mind knowing the car seat straps are properly positioned. Plus, the quality is amazing!",
    },
    {
      name: "Jessica L.",
      text: "We love our custom poncho! The fabric is so soft, and the design is perfect. It's become a staple in our winter routine. Highly recommend!",
    },
    {
      name: "Amanda K.",
      text: "As a parent, I appreciate that these ponchos are designed specifically for car seat use. The customization options are great, and the customer service is wonderful.",
    },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container py-20 md:py-32">
          <div className="grid gap-8 md:grid-cols-2 md:gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Custom Toddler Clothing
                <span className="text-primary"> Made with Love</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                {siteConfig.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg">
                  <Link href="/shop">{siteConfig.cta.shop}</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/custom-order">{siteConfig.cta.order}</Link>
                </Button>
              </div>
            </div>
            <div className="relative aspect-square">
              <Image
                src="/images/hero-image.jpg"
                alt="Custom toddler ponchos and clothing from Ducko Designs"
                fill
                className="object-cover rounded-2xl"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-muted/30">
        <div className="container">
          <TrustBadges />
        </div>
      </section>

      {/* Car Seat Explainer */}
      <section className="py-16">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Designed for Car Seat Use</h2>
              <p className="text-lg text-muted-foreground">
                Our ponchos are designed so that car seat straps can go underneath the poncho, allowing for proper strap placement. This design feature may help address concerns about bulky outerwear interfering with car seat straps. Always follow your car seat manufacturer&apos;s instructions for proper installation and use.
              </p>
              <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                <li>Designed so straps can go underneath for proper fit</li>
                <li>May reduce compression concerns compared to traditional coats</li>
                <li>Keeps your child warm while allowing strap placement underneath</li>
                <li>Designed with car seat use in mind</li>
              </ul>
              <CarSeatDisclaimer />
            </div>
            <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
              <Image
                src="/images/car-seat-diagram.jpg"
                alt="Car seat use diagram showing how poncho straps work with car seat"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <p className="text-muted-foreground">
              Explore our most popular car seat-friendly ponchos
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/shop">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container">
          <HowItWorks />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold">What Parents Say</h2>
            <p className="text-muted-foreground">
              Real feedback from families who love our ponchos
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground mb-4">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                  <p className="font-semibold">— {testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="container max-w-3xl">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">
              Everything you need to know about our ponchos
            </p>
          </div>
          <FAQAccordion faqs={faqs} />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container text-center space-y-6">
          <h2 className="text-3xl font-bold">Ready to Order Your Custom Poncho?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get started today and create the perfect car seat-friendly poncho for your little one.
          </p>
          <div className="flex flex-col items-center gap-4">
            <Button asChild size="lg">
              <Link href="/custom-order">{siteConfig.cta.order}</Link>
            </Button>
            <SocialButtons />
          </div>
        </div>
      </section>
    </>
  )
}

