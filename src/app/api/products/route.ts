import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getAllProducts, getFeaturedProducts, createProduct } from '@/lib/products'
import { ProductCategory, UserRole } from '@prisma/client'
import { logger } from '@/lib/logger'
import { ValidationError } from '@/lib/errors'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured') === 'true'

    const products = featured ? await getFeaturedProducts() : await getAllProducts()

    return NextResponse.json({ products })
  } catch (error) {
    logger.error('Failed to fetch products', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      name,
      price,
      description,
      category,
      images,
      tags,
      fabricOptions,
      sizes,
      featured,
      customizable,
      turnaround,
      isCarSeatFriendly,
      initialQuantity,
      lowStockThreshold,
    } = body

    // Validate required fields
    if (!name || !price || !description || !category || !turnaround) {
      return NextResponse.json(
        { error: 'Missing required fields: name, price, description, category, turnaround' },
        { status: 400 }
      )
    }

    // Validate category
    if (!Object.values(ProductCategory).includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      )
    }

    // Validate price
    if (typeof price !== 'number' || price < 0) {
      return NextResponse.json(
        { error: 'Price must be a positive number' },
        { status: 400 }
      )
    }

    // Create product
    const product = await createProduct({
      name,
      price,
      description,
      category: category as ProductCategory,
      images: Array.isArray(images) ? images : [],
      tags: Array.isArray(tags) ? tags : [],
      fabricOptions: Array.isArray(fabricOptions) ? fabricOptions : [],
      sizes: Array.isArray(sizes) ? sizes : [],
      featured: featured ?? false,
      customizable: customizable ?? true,
      turnaround,
      isCarSeatFriendly: isCarSeatFriendly ?? null,
      initialQuantity: initialQuantity ?? 0,
      lowStockThreshold: lowStockThreshold ?? 5,
    })

    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    logger.error('Failed to create product', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}

