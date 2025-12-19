import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ProductGallery } from "@/components/ProductGallery"
import { getProductById, products } from "@/data/products"
import { siteConfig } from "@/config/site"

interface ProductPageProps {
  params: {
    id: string
  }
}

export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }))
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = getProductById(params.id)

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

export default function ProductPage({ params }: ProductPageProps) {
  const product = getProductById(params.id)

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
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Product Gallery */}
          <div>
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold">{product.name}</h1>
              <p className="text-3xl font-bold text-primary mt-2">
                ${product.price.toFixed(2)}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-muted-foreground">{product.description}</p>
              </div>

              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Available Sizes</h2>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <span
                        key={size}
                        className="px-3 py-1 rounded-full bg-muted text-sm"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {product.fabricOptions && product.fabricOptions.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Fabric Options</h2>
                  <ul className="space-y-2">
                    {product.fabricOptions.map((fabric, index) => (
                      <li key={index} className="text-muted-foreground">
                        • {fabric}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {product.tags && product.tags.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Features</h2>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4">
              <Button asChild size="lg" className="w-full">
                <Link href={`/custom-order?product=${product.id}`}>
                  {siteConfig.cta.order}
                </Link>
              </Button>
            </div>

            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> All products are custom-made to order. 
                  Please allow 2-3 weeks for production. We&apos;ll work with you to 
                  create the perfect poncho for your little one.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}

