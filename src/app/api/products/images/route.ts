import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { UserRole } from '@prisma/client'
import { uploadBase64ProductImage } from '@/lib/storage'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { base64Data, productId, fileName } = body

    if (!base64Data || !productId || !fileName) {
      return NextResponse.json(
        { error: 'Missing required fields: base64Data, productId, fileName' },
        { status: 400 }
      )
    }

    // Upload image to Cloud Storage
    const imageUrl = await uploadBase64ProductImage(base64Data, productId, fileName)

    return NextResponse.json({ imageUrl }, { status: 201 })
  } catch (error) {
    logger.error('Failed to upload product image', error)
    return NextResponse.json(
      { error: 'Failed to upload product image' },
      { status: 500 }
    )
  }
}

