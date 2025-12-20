import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getUserById, updateUser, updateUserRole } from '@/lib/users'
import { UserRole } from '@prisma/client'
import { logger } from '@/lib/logger'
import { NotFoundError } from '@/lib/errors'

/**
 * GET /api/users/[id] - Get a single user (admin only)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await getUserById(params.id)
    return NextResponse.json({ user })
  } catch (error) {
    if (error instanceof NotFoundError) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      )
    }

    logger.error('Failed to fetch user', error)
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/users/[id] - Update user (admin only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { role, name } = body

    // If role is being updated, use updateUserRole
    if (role) {
      if (!Object.values(UserRole).includes(role)) {
        return NextResponse.json(
          { error: 'Invalid role' },
          { status: 400 }
        )
      }

      const updatedUser = await updateUserRole(
        params.id,
        role as UserRole,
        session.user.id
      )

      return NextResponse.json({ user: updatedUser })
    }

    // Otherwise, update other user fields
    if (name !== undefined) {
      const updatedUser = await updateUser(params.id, { name })
      return NextResponse.json({ user: updatedUser })
    }

    return NextResponse.json(
      { error: 'No valid fields to update' },
      { status: 400 }
    )
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      )
    }

    if (error.message === 'Cannot remove your own admin role') {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    logger.error('Failed to update user', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

