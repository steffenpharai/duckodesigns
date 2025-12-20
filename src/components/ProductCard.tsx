import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Product } from "@prisma/client"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg h-full flex flex-col">
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-square w-full overflow-hidden bg-muted">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
              No image
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-3 sm:p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-sm sm:text-base flex-1 min-w-0">{product.name}</h3>
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-muted text-muted-foreground capitalize flex-shrink-0">
            {product.category}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
          {product.description}
        </p>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {product.isCarSeatFriendly === true && (
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
              Car-seat friendly
            </span>
          )}
        </div>
        <p className="text-base sm:text-lg font-bold text-primary mt-2">
          ${product.price.toFixed(2)}
        </p>
      </CardContent>
      <CardFooter className="p-3 sm:p-4 pt-0">
        <Button asChild className="w-full min-h-[44px]">
          <Link href={`/product/${product.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

