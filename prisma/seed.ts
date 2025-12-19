import { PrismaClient, ProductCategory } from '@prisma/client'
import { products } from '../src/data/products'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Clear existing products and inventory
  console.log('Clearing existing data...')
  await prisma.inventory.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()

  // Map product categories
  const categoryMap: Record<string, ProductCategory> = {
    poncho: ProductCategory.poncho,
    pajamas: ProductCategory.pajamas,
    pants: ProductCategory.pants,
    shirt: ProductCategory.shirt,
    booties: ProductCategory.booties,
    gloves: ProductCategory.gloves,
    set: ProductCategory.set,
    accessory: ProductCategory.accessory,
    other: ProductCategory.other,
  }

  // Insert products
  console.log('Inserting products...')
  for (const product of products) {
    const created = await prisma.product.create({
      data: {
        name: product.name,
        price: product.price,
        description: product.description,
        category: categoryMap[product.category] || ProductCategory.other,
        images: product.images,
        tags: product.tags,
        fabricOptions: product.fabricOptions,
        sizes: product.sizes || [],
        featured: product.featured,
        customizable: product.customizable,
        turnaround: product.turnaround,
        isCarSeatFriendly: product.isCarSeatFriendly ?? null,
      },
    })

    // Create inventory entry for each product
    await prisma.inventory.create({
      data: {
        productId: created.id,
        quantity: 100, // Default stock
        reservedQuantity: 0,
        lowStockThreshold: 5,
      },
    })

    console.log(`Created product: ${created.name} (${created.id})`)
  }

  console.log(`Seeded ${products.length} products`)
  console.log('Seed completed!')
}

main()
  .catch((e) => {
    console.error('Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

