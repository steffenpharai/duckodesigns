import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getProductById, updateProduct, deleteProduct, getProductByIdOrThrow } from '@/lib/products'
import { ProductCategory, UserRole } from '@prisma/client'
import { NotFoundError, ValidationError } from '@/lib/errors'
import { logger } from '@/lib/logger'
import { deleteImage } from '@/lib/storage'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await getProductById(params.id)

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ product })
  } catch (error) {
    logger.error('Failed to fetch product', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const product = await getProductByIdOrThrow(params.id)
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
    } = body

    // Validate price if provided
    if (price !== undefined && (typeof price !== 'number' || price < 0)) {
      return NextResponse.json(
        { error: 'Price must be a positive number' },
        { status: 400 }
      )
    }

    // Validate category if provided
    if (category && !Object.values(ProductCategory).includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      )
    }

    // Update product
    const updatedProduct = await updateProduct(params.id, {
      name,
      price,
      description,
      category: category as ProductCategory | undefined,
      images: Array.isArray(images) ? images : undefined,
      tags: Array.isArray(tags) ? tags : undefined,
      fabricOptions: Array.isArray(fabricOptions) ? fabricOptions : undefined,
      sizes: Array.isArray(sizes) ? sizes : undefined,
      featured,
      customizable,
      turnaround,
      isCarSeatFriendly,
    })

    return NextResponse.json({ product: updatedProduct })
  } catch (error) {
    if (error instanceof NotFoundError) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      )
    }

    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    logger.error('Failed to update product', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const product = await getProductByIdOrThrow(params.id)

    // Check if product has orders
    const orderCount = await prisma.orderItem.count({
      where: { productId: params.id },
    })

    if (orderCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete product: ${orderCount} order(s) reference this product` },
        { status: 400 }
      )
    }

    // Delete product images from Cloud Storage
    if (product.images && product.images.length > 0) {
      for (const imageUrl of product.images) {
        try {
          await deleteImage(imageUrl)
        } catch (error) {
          // Log error but continue with deletion
          logger.warn('Failed to delete product image', { imageUrl, error })
        }
      }
    }

    // Delete product (inventory will be deleted via cascade)
    await deleteProduct(params.id)

    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    if (error instanceof NotFoundError) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      )
    }

    logger.error('Failed to delete product', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}

