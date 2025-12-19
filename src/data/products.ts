export type ProductCategory = "poncho" | "pajamas" | "pants" | "shirt" | "booties" | "gloves" | "set" | "accessory" | "other"

export interface Product {
  id: string
  name: string
  price: number
  images: string[]
  description: string
  tags: string[]
  category: ProductCategory
  featured: boolean
  fabricOptions: string[]
  sizes?: string[]
  customizable: boolean
  turnaround: string
  isCarSeatFriendly?: boolean
}

export const products: Product[] = [
  // Ponchos
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
    customizable: true,
    turnaround: "1–2 weeks",
    isCarSeatFriendly: true,
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
    customizable: true,
    turnaround: "1–2 weeks",
    isCarSeatFriendly: true,
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
    customizable: true,
    turnaround: "1–2 weeks",
    isCarSeatFriendly: true,
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
    customizable: true,
    turnaround: "1–2 weeks",
    isCarSeatFriendly: true,
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
    customizable: true,
    turnaround: "1–2 weeks",
    isCarSeatFriendly: true,
  },
  {
    id: "playground-poncho",
    name: "Playground Poncho",
    price: 42.00,
    images: [
      "/images/products/classic-poncho-1.jpg",
    ],
    description: "A versatile poncho perfect for outdoor play. Not designed for car seat use, but great for keeping little ones warm during active play.",
    tags: ["playful", "versatile", "outdoor"],
    category: "poncho",
    featured: false,
    fabricOptions: [
      "Fleece - Soft and warm",
      "Cotton - Lightweight option",
    ],
    sizes: ["12-18 months", "18-24 months", "2T", "3T", "4T"],
    customizable: true,
    turnaround: "1–2 weeks",
    isCarSeatFriendly: false,
  },
  // Pajamas
  {
    id: "cozy-pajamas-1",
    name: "Cozy Two-Piece Pajamas",
    price: 38.00,
    images: [
      "/images/products/classic-poncho-1.jpg",
    ],
    description: "Soft and comfortable two-piece pajama set perfect for bedtime. Made with premium cotton blend that's gentle on sensitive skin.",
    tags: ["comfortable", "soft", "bedtime"],
    category: "pajamas",
    featured: true,
    fabricOptions: [
      "Cotton Blend - Soft and breathable",
      "Flannel - Extra warm",
      "Jersey - Stretchy and comfortable",
    ],
    sizes: ["12-18 months", "18-24 months", "2T", "3T", "4T"],
    customizable: true,
    turnaround: "1–2 weeks",
  },
  {
    id: "footie-pajamas",
    name: "Snug Footie Pajamas",
    price: 42.00,
    images: [
      "/images/products/classic-poncho-1.jpg",
    ],
    description: "One-piece footie pajamas with built-in feet to keep little toes warm. Perfect for cold nights and cozy mornings.",
    tags: ["warm", "footie", "one-piece"],
    category: "pajamas",
    featured: true,
    fabricOptions: [
      "Fleece - Soft and warm",
      "Cotton Blend - Breathable",
    ],
    sizes: ["12-18 months", "18-24 months", "2T", "3T", "4T"],
    customizable: true,
    turnaround: "1–2 weeks",
  },
  // Booties
  {
    id: "warm-booties-1",
    name: "Cozy Winter Booties",
    price: 22.00,
    images: [
      "/images/products/classic-poncho-1.jpg",
    ],
    description: "Soft, warm booties to keep little feet cozy. Perfect for indoor wear or as an extra layer under shoes.",
    tags: ["warm", "soft", "indoor"],
    category: "booties",
    featured: true,
    fabricOptions: [
      "Fleece - Soft and warm",
      "Sherpa - Extra cozy",
      "Minky - Luxuriously soft",
    ],
    sizes: ["12-18 months", "18-24 months", "2T", "3T", "4T"],
    customizable: true,
    turnaround: "1–2 weeks",
  },
  {
    id: "gripper-booties",
    name: "Gripper Sole Booties",
    price: 24.00,
    images: [
      "/images/products/classic-poncho-1.jpg",
    ],
    description: "Non-slip booties with gripper soles for active toddlers. Keeps feet warm while allowing safe movement.",
    tags: ["gripper", "non-slip", "active"],
    category: "booties",
    featured: false,
    fabricOptions: [
      "Fleece - Soft and warm",
      "Cotton Blend - Breathable",
    ],
    sizes: ["18-24 months", "2T", "3T", "4T"],
    customizable: true,
    turnaround: "1–2 weeks",
  },
  // Gloves
  {
    id: "mittens-1",
    name: "Warm Toddler Mittens",
    price: 18.00,
    images: [
      "/images/products/classic-poncho-1.jpg",
    ],
    description: "Cozy mittens to keep little hands warm during cold weather. Made with soft, warm fabrics.",
    tags: ["warm", "mittens", "winter"],
    category: "gloves",
    featured: true,
    fabricOptions: [
      "Fleece - Soft and warm",
      "Sherpa - Extra cozy",
    ],
    sizes: ["12-18 months", "18-24 months", "2T", "3T", "4T"],
    customizable: true,
    turnaround: "1–2 weeks",
  },
  {
    id: "finger-gloves",
    name: "Finger Gloves",
    price: 20.00,
    images: [
      "/images/products/classic-poncho-1.jpg",
    ],
    description: "Finger gloves for toddlers who need dexterity. Keeps hands warm while allowing finger movement.",
    tags: ["finger", "dexterity", "warm"],
    category: "gloves",
    featured: false,
    fabricOptions: [
      "Fleece - Soft and warm",
      "Cotton Blend - Lightweight",
    ],
    sizes: ["18-24 months", "2T", "3T", "4T"],
    customizable: true,
    turnaround: "1–2 weeks",
  },
  // Shirts
  {
    id: "long-sleeve-shirt",
    name: "Custom Long-Sleeve Shirt",
    price: 28.00,
    images: [
      "/images/products/classic-poncho-1.jpg",
    ],
    description: "Comfortable long-sleeve shirt perfect for layering or wearing alone. Made with soft, breathable fabrics.",
    tags: ["comfortable", "versatile", "layering"],
    category: "shirt",
    featured: true,
    fabricOptions: [
      "Cotton - Soft and breathable",
      "Cotton Blend - Durable",
      "Jersey - Stretchy",
    ],
    sizes: ["12-18 months", "18-24 months", "2T", "3T", "4T"],
    customizable: true,
    turnaround: "1–2 weeks",
  },
  {
    id: "short-sleeve-shirt",
    name: "Custom Short-Sleeve Shirt",
    price: 24.00,
    images: [
      "/images/products/classic-poncho-1.jpg",
    ],
    description: "Lightweight short-sleeve shirt perfect for warmer weather. Comfortable and easy to move in.",
    tags: ["lightweight", "summer", "comfortable"],
    category: "shirt",
    featured: false,
    fabricOptions: [
      "Cotton - Soft and breathable",
      "Jersey - Stretchy",
    ],
    sizes: ["12-18 months", "18-24 months", "2T", "3T", "4T"],
    customizable: true,
    turnaround: "1–2 weeks",
  },
  // Pants
  {
    id: "soft-pants-1",
    name: "Comfortable Soft Pants",
    price: 32.00,
    images: [
      "/images/products/classic-poncho-1.jpg",
    ],
    description: "Soft, stretchy pants perfect for playtime and everyday wear. Made with comfortable fabrics that move with your child.",
    tags: ["comfortable", "stretchy", "playtime"],
    category: "pants",
    featured: true,
    fabricOptions: [
      "Cotton Blend - Soft and durable",
      "Jersey - Stretchy and comfortable",
      "Fleece - Warm option",
    ],
    sizes: ["12-18 months", "18-24 months", "2T", "3T", "4T"],
    customizable: true,
    turnaround: "1–2 weeks",
  },
  {
    id: "leggings",
    name: "Stretchy Leggings",
    price: 26.00,
    images: [
      "/images/products/classic-poncho-1.jpg",
    ],
    description: "Stretchy leggings that fit comfortably and allow for active play. Perfect for layering or wearing alone.",
    tags: ["stretchy", "active", "versatile"],
    category: "pants",
    featured: false,
    fabricOptions: [
      "Jersey - Stretchy and comfortable",
      "Cotton Blend - Soft",
    ],
    sizes: ["12-18 months", "18-24 months", "2T", "3T", "4T"],
    customizable: true,
    turnaround: "1–2 weeks",
  },
  // Sets
  {
    id: "outfit-set-1",
    name: "Matching Outfit Set",
    price: 55.00,
    images: [
      "/images/products/classic-poncho-1.jpg",
    ],
    description: "Coordinated shirt and pants set that looks great together. Perfect for special occasions or everyday style.",
    tags: ["matching", "coordinated", "outfit"],
    category: "set",
    featured: true,
    fabricOptions: [
      "Cotton Blend - Soft and durable",
      "Jersey - Stretchy and comfortable",
    ],
    sizes: ["12-18 months", "18-24 months", "2T", "3T", "4T"],
    customizable: true,
    turnaround: "1–2 weeks",
  },
  {
    id: "pajama-set",
    name: "Complete Pajama Set",
    price: 48.00,
    images: [
      "/images/products/classic-poncho-1.jpg",
    ],
    description: "Complete pajama set with matching top and bottom. Cozy and comfortable for a good night's sleep.",
    tags: ["pajamas", "matching", "cozy"],
    category: "set",
    featured: false,
    fabricOptions: [
      "Cotton Blend - Soft and breathable",
      "Flannel - Extra warm",
    ],
    sizes: ["12-18 months", "18-24 months", "2T", "3T", "4T"],
    customizable: true,
    turnaround: "1–2 weeks",
  },
]

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id)
}

export function getFeaturedProducts(): Product[] {
  return products.filter((product) => product.featured)
}

