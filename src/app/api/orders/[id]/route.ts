import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getOrderById, updateOrder, deleteOrder, updateOrderStatus } from '@/lib/orders'
import { OrderStatus, UserRole } from '@prisma/client'
import { logger } from '@/lib/logger'
import { NotFoundError } from '@/lib/errors'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const order = await getOrderById(params.id)

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Users can only view their own orders, admins can view all
    if (session.user.role !== UserRole.ADMIN && order.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    return NextResponse.json({ order })
  } catch (error) {
    logger.error('Failed to fetch order', error)
    return NextResponse.json(
      { error: 'Failed to fetch order' },
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

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const order = await getOrderById(params.id)

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Only admins can update orders
    if (session.user.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { status, ...updateData } = body

    // Update status separately if provided
    if (status && Object.values(OrderStatus).includes(status)) {
      await updateOrderStatus(params.id, status as OrderStatus)
    }

    // Update other fields
    if (Object.keys(updateData).length > 0) {
      await updateOrder(params.id, updateData)
    }

    const updatedOrder = await getOrderById(params.id)

    return NextResponse.json({ order: updatedOrder })
  } catch (error) {
    logger.error('Failed to update order', error)
    return NextResponse.json(
      { error: 'Failed to update order' },
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

    await deleteOrder(params.id)

    return NextResponse.json({ message: 'Order deleted' })
  } catch (error) {
    if (error instanceof NotFoundError) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      )
    }

    logger.error('Failed to delete order', error)
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    )
  }
}

