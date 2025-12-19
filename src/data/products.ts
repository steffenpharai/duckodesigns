export interface Product {
  id: string
  name: string
  price: number
  images: string[]
  description: string
  tags: string[]
  category: "poncho" | "accessory"
  featured: boolean
  fabricOptions: string[]
  sizes?: string[]
}

export const products: Product[] = [
  {
    id: "classic-poncho-1",
    name: "Classic Car Seat Poncho",
    price: 45.00,
    images: [
      "/images/products/classic-poncho-1.jpg",
      "/images/products/classic-poncho-2.jpg",
    ],
    description: "Our signature poncho designed for car seat use. Soft, warm, and designed to allow car seat straps to go underneath. Made with premium fabrics and attention to detail.",
    tags: ["car-seat-friendly", "warm", "customizable"],
    category: "poncho",
    featured: true,
    fabricOptions: [
      "Fleece - Soft and warm",
      "Sherpa - Extra cozy",
      "Minky - Luxuriously soft",
      "Cotton - Lightweight option",
    ],
    sizes: ["12-18 months", "18-24 months", "2T", "3T", "4T"],
  },
  {
    id: "rainbow-poncho",
    name: "Rainbow Dreams Poncho",
    price: 48.00,
    images: [
      "/images/products/rainbow-poncho-1.jpg",
    ],
    description: "Bright and cheerful poncho featuring rainbow patterns. Perfect for adding a pop of color to your little one's wardrobe while keeping them warm in the car.",
    tags: ["colorful", "car-seat-friendly", "playful"],
    category: "poncho",
    featured: true,
    fabricOptions: [
      "Fleece - Soft and warm",
      "Minky - Luxuriously soft",
    ],
    sizes: ["12-18 months", "18-24 months", "2T", "3T", "4T"],
  },
  {
    id: "animal-poncho",
    name: "Wild Animal Poncho",
    price: 50.00,
    images: [
      "/images/products/animal-poncho-1.jpg",
    ],
    description: "Adorable animal-themed poncho that kids love. Features cute animal prints and patterns, designed for car seat use.",
    tags: ["animals", "car-seat-friendly", "fun"],
    category: "poncho",
    featured: true,
    fabricOptions: [
      "Fleece - Soft and warm",
      "Sherpa - Extra cozy",
      "Minky - Luxuriously soft",
    ],
    sizes: ["12-18 months", "18-24 months", "2T", "3T", "4T"],
  },
  {
    id: "neutral-poncho",
    name: "Neutral Elegance Poncho",
    price: 45.00,
    images: [
      "/images/products/neutral-poncho-1.jpg",
    ],
    description: "Sophisticated neutral tones perfect for any occasion. Timeless design that pairs well with any outfit while keeping your child warm.",
    tags: ["neutral", "car-seat-friendly", "versatile"],
    category: "poncho",
    featured: false,
    fabricOptions: [
      "Fleece - Soft and warm",
      "Cotton - Lightweight option",
    ],
    sizes: ["12-18 months", "18-24 months", "2T", "3T", "4T"],
  },
  {
    id: "holiday-poncho",
    name: "Holiday Special Poncho",
    price: 52.00,
    images: [
      "/images/products/holiday-poncho-1.jpg",
    ],
    description: "Special edition poncho perfect for holiday seasons. Festive patterns and colors that celebrate the season, designed for car seat use.",
    tags: ["holiday", "car-seat-friendly", "seasonal"],
    category: "poncho",
    featured: false,
    fabricOptions: [
      "Fleece - Soft and warm",
      "Sherpa - Extra cozy",
    ],
    sizes: ["12-18 months", "18-24 months", "2T", "3T", "4T"],
  },
]

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id)
}

export function getFeaturedProducts(): Product[] {
  return products.filter((product) => product.featured)
}

