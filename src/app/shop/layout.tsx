import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse our collection of custom toddler clothing & accessories.",
  openGraph: {
    title: "Shop | Ducko Designs",
    description: "Browse our collection of custom toddler clothing & accessories.",
  },
}

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

