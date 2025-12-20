import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ProductGallery } from "@/components/ProductGallery"
import { getProductById } from "@/lib/products"
import { getAllProducts } from "@/lib/products"
import { siteConfig } from "@/config/site"

interface ProductPageProps {
  params: {
    id: string
  }
}

// Dynamic route - no static generation
export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = await getProductById(params.id)

  if (!product) {
    return {
      title: "Product Not Found",
    }
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} | ${siteConfig.name}`,
      description: product.description,
      images: product.images,
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductById(params.id)

  if (!product) {
    notFound()
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container py-8 md:py-12">
        <div className="grid gap-6 md:gap-8 md:grid-cols-2">
          {/* Product Gallery */}
          <div>
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Product Details */}
          <div className="space-y-4 md:space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">{product.name}</h1>
              <p className="text-2xl sm:text-3xl font-bold text-primary mt-2">
                ${product.price.toFixed(2)}
              </p>
            </div>

            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1.5 rounded-full bg-muted text-xs sm:text-sm font-medium capitalize min-h-[32px] flex items-center">
                  {product.category}
                </span>
                {product.isCarSeatFriendly && (
                  <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium min-h-[32px] flex items-center">
                    Car-seat friendly
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-semibold mb-2">Description</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{product.description}</p>
              </div>

              {product.isCarSeatFriendly === true && (
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2 text-primary">Car-Seat Friendly Design</h3>
                    <p className="text-sm text-muted-foreground">
                      This {product.category} is designed so that car seat straps can go underneath, allowing for proper strap placement. This design feature may help address concerns about bulky outerwear interfering with car seat straps. Always follow your car seat manufacturer&apos;s instructions for proper installation and use.
                    </p>
                  </CardContent>
                </Card>
              )}

              {product.turnaround && (
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold mb-2">Turnaround Time</h2>
                  <p className="text-sm sm:text-base text-muted-foreground">{product.turnaround}</p>
                </div>
              )}

              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold mb-2">Available Sizes</h2>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <span
                        key={size}
                        className="px-3 py-1.5 rounded-full bg-muted text-xs sm:text-sm min-h-[32px] flex items-center"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {product.fabricOptions && product.fabricOptions.length > 0 && (
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold mb-2">Fabric Options</h2>
                  <ul className="space-y-1.5 sm:space-y-2">
                    {product.fabricOptions.map((fabric, index) => (
                      <li key={index} className="text-sm sm:text-base text-muted-foreground">
                        • {fabric}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {product.tags && product.tags.length > 0 && (
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold mb-2">Features</h2>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm min-h-[32px] flex items-center"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4">
              <Button asChild size="lg" className="w-full min-h-[44px]">
                <Link href={`/custom-order?product=${product.id}&type=${product.category}`}>
                  {siteConfig.cta.order}
                </Link>
              </Button>
            </div>

            <Card>
              <CardContent className="pt-4 md:pt-6">
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  <strong>Note:</strong> All products are custom-made to order. 
                  {product.turnaround ? ` Please allow ${product.turnaround} for production.` : " Please allow 1–2 weeks for production."} We&apos;ll work with you to 
                  create the perfect {product.category} for your little one.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}

