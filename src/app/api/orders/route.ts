import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getAllOrders, getOrdersByUserId } from '@/lib/orders'
import { OrderStatus, UserRole } from '@prisma/client'
import { logger } from '@/lib/logger'
import { UnauthorizedError } from '@/lib/errors'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as OrderStatus | null
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined

    // Admin can see all orders, users can only see their own
    if (session.user.role === UserRole.ADMIN) {
      const result = await getAllOrders({
        status: status || undefined,
        limit,
        offset,
      })
      return NextResponse.json(result)
    } else {
      const orders = await getOrdersByUserId(session.user.id)
      return NextResponse.json({ orders, total: orders.length })
    }
  } catch (error) {
    logger.error('Failed to fetch orders', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Only admins can create orders via this endpoint
    // Regular users should use /api/custom-order
    if (session.user.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { createOrder } = await import('@/lib/orders')
    const order = await createOrder(body)

    return NextResponse.json({ order }, { status: 201 })
  } catch (error) {
    logger.error('Failed to create order', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

