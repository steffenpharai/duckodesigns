import { prisma } from './db'
import { NotFoundError } from './errors'

/**
 * Get inventory for a product
 */
export async function getInventoryByProductId(productId: string) {
  return prisma.inventory.findUnique({
    where: { productId },
    include: {
      product: true,
    },
  })
}

/**
 * Get inventory for a product or throw if not found
 */
export async function getInventoryByProductIdOrThrow(productId: string) {
  const inventory = await getInventoryByProductId(productId)
  if (!inventory) {
    throw new NotFoundError('Inventory', productId)
  }
  return inventory
}

/**
 * Get all inventory items
 */
export async function getAllInventory() {
  return prisma.inventory.findMany({
    include: {
      product: true,
    },
    orderBy: {
      product: {
        name: 'asc',
      },
    },
  })
}

/**
 * Get low stock items
 */
export async function getLowStockItems() {
  return prisma.inventory.findMany({
    where: {
      quantity: {
        lte: prisma.inventory.fields.lowStockThreshold,
      },
    },
    include: {
      product: true,
    },
    orderBy: {
      quantity: 'asc',
    },
  })
}

/**
 * Update inventory quantity
 */
export async function updateInventoryQuantity(
  productId: string,
  quantity: number
) {
  const inventory = await getInventoryByProductIdOrThrow(productId)
  
  return prisma.inventory.update({
    where: { productId },
    data: { quantity },
  })
}

/**
 * Reserve inventory (decrease available quantity)
 */
export async function reserveInventory(
  productId: string,
  quantity: number
): Promise<boolean> {
  try {
    const inventory = await getInventoryByProductIdOrThrow(productId)
    
    const availableQuantity = inventory.quantity - inventory.reservedQuantity
    
    if (availableQuantity < quantity) {
      return false // Not enough stock
    }

    await prisma.inventory.update({
      where: { productId },
      data: {
        reservedQuantity: {
          increment: quantity,
        },
      },
    })

    return true
  } catch (error) {
    throw error
  }
}

/**
 * Release reserved inventory
 */
export async function releaseReservedInventory(
  productId: string,
  quantity: number
) {
  const inventory = await getInventoryByProductIdOrThrow(productId)
  
  const newReservedQuantity = Math.max(0, inventory.reservedQuantity - quantity)
  
  return prisma.inventory.update({
    where: { productId },
    data: {
      reservedQuantity: newReservedQuantity,
    },
  })
}

/**
 * Fulfill reserved inventory (convert reserved to sold)
 */
export async function fulfillReservedInventory(
  productId: string,
  quantity: number
) {
  const inventory = await getInventoryByProductIdOrThrow(productId)
  
  if (inventory.reservedQuantity < quantity) {
    throw new Error('Cannot fulfill more than reserved quantity')
  }

  return prisma.inventory.update({
    where: { productId },
    data: {
      quantity: {
        decrement: quantity,
      },
      reservedQuantity: {
        decrement: quantity,
      },
    },
  })
}

/**
 * Set low stock threshold
 */
export async function setLowStockThreshold(
  productId: string,
  threshold: number
) {
  const inventory = await getInventoryByProductIdOrThrow(productId)
  
  return prisma.inventory.update({
    where: { productId },
    data: { lowStockThreshold: threshold },
  })
}

/**
 * Get available quantity (quantity - reserved)
 */
export async function getAvailableQuantity(productId: string): Promise<number> {
  const inventory = await getInventoryByProductId(productId)
  
  if (!inventory) {
    return 0
  }

  return inventory.quantity - inventory.reservedQuantity
}

