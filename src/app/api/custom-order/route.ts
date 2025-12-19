import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createOrder } from "@/lib/orders"
import { uploadBase64Image } from "@/lib/storage"
import { logger } from "@/lib/logger"
import { siteConfig } from "@/config/site"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()

    // Extract and validate required fields
    const {
      name,
      email,
      phone,
      childSize,
      productType,
      fabricPreference,
      personalization,
      deadline,
      carSeatFriendlyRequested,
      imageBase64,
      productId,
    } = body

    if (!name || !email || !childSize || !productType) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      )
    }

    // Upload image if provided
    let imageUrl: string | undefined
    if (imageBase64) {
      try {
        const fileName = `order-${Date.now()}-${name.replace(/[^a-zA-Z0-9]/g, '_')}.jpg`
        imageUrl = await uploadBase64Image(imageBase64, fileName)
        logger.info('Order image uploaded', { imageUrl })
      } catch (error) {
        logger.error('Failed to upload order image', error)
        // Continue without image if upload fails
      }
    }

    // Parse deadline if provided
    let deadlineDate: Date | undefined
    if (deadline) {
      deadlineDate = new Date(deadline)
      if (isNaN(deadlineDate.getTime())) {
        deadlineDate = undefined
      }
    }

    // Create order in database
    const order = await createOrder({
      userId: session?.user?.id,
      name,
      email,
      phone: phone || undefined,
      childSize,
      productType,
      fabricPreference: fabricPreference || undefined,
      personalization: personalization || undefined,
      deadline: deadlineDate,
      carSeatFriendlyRequested: carSeatFriendlyRequested || false,
      imageUrl,
      productId: productId || undefined,
    })

    logger.info('Custom order created', {
      orderId: order.id,
      email,
      productType,
    })

    // TODO: Send email notification
    // await sendEmail({
    //   to: siteConfig.contact.email,
    //   subject: `New Custom Order from ${name}`,
    //   body: formatOrderEmail(body),
    // })

    return NextResponse.json(
      {
        success: true,
        message: "Order request received",
        orderId: order.id,
      },
      { status: 201 }
    )
  } catch (error) {
    logger.error("Error processing order", error)
    return NextResponse.json(
      { success: false, message: "Error processing order" },
      { status: 500 }
    )
  }
}

