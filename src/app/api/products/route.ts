import { NextResponse } from 'next/server'
import { getAllProducts, getFeaturedProducts } from '@/lib/products'
import { logger } from '@/lib/logger'

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

