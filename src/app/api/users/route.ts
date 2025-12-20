import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getAllUsers, updateUserRole } from '@/lib/users'
import { UserRole } from '@prisma/client'
import { logger } from '@/lib/logger'
import { ValidationError } from '@/lib/errors'

/**
 * GET /api/users - List all users (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50
    const search = searchParams.get('search') || undefined
    const role = searchParams.get('role') as UserRole | null

    const result = await getAllUsers({
      page,
      limit,
      search,
      role: role || undefined,
    })

    return NextResponse.json(result)
  } catch (error) {
    logger.error('Failed to fetch users', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/users - Update user role (admin only)
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { userId, role } = body

    if (!userId || !role) {
      return NextResponse.json(
        { error: 'userId and role are required' },
        { status: 400 }
      )
    }

    if (!Object.values(UserRole).includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      )
    }

    const updatedUser = await updateUserRole(
      userId,
      role as UserRole,
      session.user.id
    )

    return NextResponse.json({ user: updatedUser })
  } catch (error: any) {
    if (error.message === 'Cannot remove your own admin role') {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    logger.error('Failed to update user role', error)
    return NextResponse.json(
      { error: 'Failed to update user role' },
      { status: 500 }
    )
  }
}

