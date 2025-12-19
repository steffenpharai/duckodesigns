import { prisma } from './db'
import { Product, ProductCategory } from '@prisma/client'
import { NotFoundError } from './errors'

export type { Product, ProductCategory }

/**
 * Get all products
 */
export async function getAllProducts(): Promise<Product[]> {
  return prisma.product.findMany({
    orderBy: [
      { featured: 'desc' },
      { createdAt: 'desc' },
    ],
  })
}

/**
 * Get product by ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  return prisma.product.findUnique({
    where: { id },
  })
}

/**
 * Get product by ID or throw if not found
 */
export async function getProductByIdOrThrow(id: string): Promise<Product> {
  const product = await getProductById(id)
  if (!product) {
    throw new NotFoundError('Product', id)
  }
  return product
}

/**
 * Get featured products
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  return prisma.product.findMany({
    where: { featured: true },
    orderBy: { createdAt: 'desc' },
  })
}

/**
 * Get products by category
 */
export async function getProductsByCategory(category: ProductCategory): Promise<Product[]> {
  return prisma.product.findMany({
    where: { category },
    orderBy: { createdAt: 'desc' },
  })
}

/**
 * Search products by name or description
 */
export async function searchProducts(query: string): Promise<Product[]> {
  return prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { tags: { has: query } },
      ],
    },
    orderBy: { createdAt: 'desc' },
  })
}

/**
 * Create a new product
 */
export async function createProduct(data: {
  name: string
  price: number
  description: string
  category: ProductCategory
  images?: string[]
  tags?: string[]
  fabricOptions?: string[]
  sizes?: string[]
  featured?: boolean
  customizable?: boolean
  turnaround: string
  isCarSeatFriendly?: boolean | null
}): Promise<Product> {
  return prisma.product.create({
    data: {
      name: data.name,
      price: data.price,
      description: data.description,
      category: data.category,
      images: data.images || [],
      tags: data.tags || [],
      fabricOptions: data.fabricOptions || [],
      sizes: data.sizes || [],
      featured: data.featured ?? false,
      customizable: data.customizable ?? true,
      turnaround: data.turnaround,
      isCarSeatFriendly: data.isCarSeatFriendly ?? null,
    },
  })
}

/**
 * Update a product
 */
export async function updateProduct(
  id: string,
  data: Partial<{
    name: string
    price: number
    description: string
    category: ProductCategory
    images: string[]
    tags: string[]
    fabricOptions: string[]
    sizes: string[]
    featured: boolean
    customizable: boolean
    turnaround: string
    isCarSeatFriendly: boolean | null
  }>
): Promise<Product> {
  const product = await getProductByIdOrThrow(id)
  
  return prisma.product.update({
    where: { id },
    data,
  })
}

/**
 * Delete a product
 */
export async function deleteProduct(id: string): Promise<void> {
  const product = await getProductByIdOrThrow(id)
  
  await prisma.product.delete({
    where: { id },
  })
}

