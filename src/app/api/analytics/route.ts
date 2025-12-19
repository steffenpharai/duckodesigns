import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getAllOrders } from '@/lib/orders'
import { getAllProducts } from '@/lib/products'
import { getLowStockItems } from '@/lib/inventory'
import { UserRole, OrderStatus } from '@prisma/client'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const [ordersData, products, lowStock] = await Promise.all([
      getAllOrders(),
      getAllProducts(),
      getLowStockItems(),
    ])

    const orders = ordersData.orders

    // Filter by date range if provided
    let filteredOrders = orders
    if (startDate || endDate) {
      filteredOrders = orders.filter((order) => {
        const orderDate = new Date(order.createdAt)
        if (startDate && orderDate < new Date(startDate)) return false
        if (endDate && orderDate > new Date(endDate)) return false
        return true
      })
    }

    // Calculate statistics
    const totalOrders = filteredOrders.length
    const pendingOrders = filteredOrders.filter((o) => o.status === OrderStatus.PENDING).length
    const inProgressOrders = filteredOrders.filter((o) => o.status === OrderStatus.IN_PROGRESS).length
    const completedOrders = filteredOrders.filter((o) => o.status === OrderStatus.COMPLETED).length
    const cancelledOrders = filteredOrders.filter((o) => o.status === OrderStatus.CANCELLED).length

    // Calculate revenue
    const completedOrdersList = filteredOrders.filter((o) => o.status === OrderStatus.COMPLETED)
    const revenue = completedOrdersList.reduce((sum, order) => {
      const orderTotal = order.orderItems.reduce((itemSum, item) => {
        return itemSum + item.price * item.quantity
      }, 0)
      return sum + orderTotal
    }, 0)

    // Orders by product type
    const ordersByProductType = filteredOrders.reduce((acc, order) => {
      acc[order.productType] = (acc[order.productType] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Orders by month
    const ordersByMonth = filteredOrders.reduce((acc, order) => {
      const month = new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
      acc[month] = (acc[month] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Average order value (for completed orders)
    const averageOrderValue = completedOrdersList.length > 0
      ? revenue / completedOrdersList.length
      : 0

    return NextResponse.json({
      summary: {
        totalOrders,
        pendingOrders,
        inProgressOrders,
        completedOrders,
        cancelledOrders,
        totalRevenue: revenue,
        averageOrderValue,
        totalProducts: products.length,
        lowStockItems: lowStock.length,
      },
      breakdowns: {
        byProductType: ordersByProductType,
        byMonth: ordersByMonth,
      },
    })
  } catch (error) {
    logger.error('Failed to fetch analytics', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}

