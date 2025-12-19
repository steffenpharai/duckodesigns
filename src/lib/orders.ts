import { prisma } from './db'
import { OrderStatus, UserRole } from '@prisma/client'
import { NotFoundError } from './errors'
import { reserveInventory } from './inventory'

export type { OrderStatus }

/**
 * Create a new order
 */
export async function createOrder(data: {
  userId?: string
  name: string
  email: string
  phone?: string
  childSize: string
  productType: string
  fabricPreference?: string
  personalization?: string
  deadline?: Date
  carSeatFriendlyRequested?: boolean
  imageUrl?: string
  productId?: string
}): Promise<{ id: string }> {
  // Reserve inventory if productId is provided
  if (data.productId) {
    try {
      const reserved = await reserveInventory(data.productId, 1)
      if (!reserved) {
        // Log warning but continue with order creation
        // In production, you might want to handle this differently
        console.warn(`Could not reserve inventory for product ${data.productId}`)
      }
    } catch (error) {
      // Log error but continue with order creation
      // Inventory might not exist for custom products
      console.warn(`Failed to reserve inventory: ${error}`)
    }
  }

  const order = await prisma.order.create({
    data: {
      userId: data.userId || null,
      status: OrderStatus.PENDING,
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      childSize: data.childSize,
      productType: data.productType,
      fabricPreference: data.fabricPreference || null,
      personalization: data.personalization || null,
      deadline: data.deadline || null,
      carSeatFriendlyRequested: data.carSeatFriendlyRequested || false,
      imageUrl: data.imageUrl || null,
      productId: data.productId || null,
    },
    select: {
      id: true,
    },
  })

  return order
}

/**
 * Get order by ID
 */
export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  })
}

/**
 * Get order by ID or throw if not found
 */
export async function getOrderByIdOrThrow(id: string) {
  const order = await getOrderById(id)
  if (!order) {
    throw new NotFoundError('Order', id)
  }
  return order
}

/**
 * Get orders for a user
 */
export async function getOrdersByUserId(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  })
}

/**
 * Get all orders (admin only)
 */
export async function getAllOrders(filters?: {
  status?: OrderStatus
  limit?: number
  offset?: number
}) {
  const where = filters?.status ? { status: filters.status } : {}
  const take = filters?.limit
  const skip = filters?.offset

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take,
      skip,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    }),
    prisma.order.count({ where }),
  ])

  return { orders, total }
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  id: string,
  status: OrderStatus
) {
  const order = await getOrderByIdOrThrow(id)
  
  return prisma.order.update({
    where: { id },
    data: { status },
  })
}

/**
 * Update order
 */
export async function updateOrder(
  id: string,
  data: Partial<{
    status: OrderStatus
    name: string
    email: string
    phone: string
    childSize: string
    productType: string
    fabricPreference: string
    personalization: string
    deadline: Date
    carSeatFriendlyRequested: boolean
    imageUrl: string
    productId: string
  }>
) {
  const order = await getOrderByIdOrThrow(id)
  
  return prisma.order.update({
    where: { id },
    data,
  })
}

/**
 * Delete order
 */
export async function deleteOrder(id: string) {
  const order = await getOrderByIdOrThrow(id)
  
  await prisma.order.delete({
    where: { id },
  })
}

