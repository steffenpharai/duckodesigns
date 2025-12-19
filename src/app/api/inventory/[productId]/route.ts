import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import {
  getInventoryByProductId,
  updateInventoryQuantity,
  setLowStockThreshold,
  reserveInventory,
  releaseReservedInventory,
  fulfillReservedInventory,
} from '@/lib/inventory'
import { UserRole } from '@prisma/client'
import { logger } from '@/lib/logger'
import { NotFoundError } from '@/lib/errors'

export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const inventory = await getInventoryByProductId(params.productId)

    if (!inventory) {
      return NextResponse.json(
        { error: 'Inventory not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ inventory })
  } catch (error) {
    logger.error('Failed to fetch inventory', error)
    return NextResponse.json(
      { error: 'Failed to fetch inventory' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { quantity, lowStockThreshold, action, reserveQuantity, fulfillQuantity, releaseQuantity } = body

    let inventory

    if (action === 'reserve' && reserveQuantity) {
      const success = await reserveInventory(params.productId, reserveQuantity)
      if (!success) {
        return NextResponse.json(
          { error: 'Not enough stock available' },
          { status: 400 }
        )
      }
      inventory = await getInventoryByProductId(params.productId)
    } else if (action === 'fulfill' && fulfillQuantity) {
      await fulfillReservedInventory(params.productId, fulfillQuantity)
      inventory = await getInventoryByProductId(params.productId)
    } else if (action === 'release' && releaseQuantity) {
      await releaseReservedInventory(params.productId, releaseQuantity)
      inventory = await getInventoryByProductId(params.productId)
    } else if (quantity !== undefined) {
      inventory = await updateInventoryQuantity(params.productId, quantity)
    } else if (lowStockThreshold !== undefined) {
      inventory = await setLowStockThreshold(params.productId, lowStockThreshold)
    } else {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    return NextResponse.json({ inventory })
  } catch (error) {
    if (error instanceof NotFoundError) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      )
    }

    logger.error('Failed to update inventory', error)
    return NextResponse.json(
      { error: 'Failed to update inventory' },
      { status: 500 }
    )
  }
}

