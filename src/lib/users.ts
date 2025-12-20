import { prisma } from './db'
import { UserRole } from '@prisma/client'
import { NotFoundError } from './errors'
import { logger } from './logger'

export interface GetAllUsersParams {
  page?: number
  limit?: number
  search?: string
  role?: UserRole
}

export interface GetAllUsersResult {
  users: Array<{
    id: string
    email: string
    name: string | null
    role: UserRole
    createdAt: Date
    updatedAt: Date
    orderCount: number
  }>
  total: number
  page: number
  limit: number
  totalPages: number
}

/**
 * Get all users with pagination and filtering
 */
export async function getAllUsers(
  params: GetAllUsersParams = {}
): Promise<GetAllUsersResult> {
  const page = params.page || 1
  const limit = params.limit || 50
  const skip = (page - 1) * limit

  const where: any = {}

  if (params.search) {
    where.OR = [
      { email: { contains: params.search, mode: 'insensitive' } },
      { name: { contains: params.search, mode: 'insensitive' } },
    ]
  }

  if (params.role) {
    where.role = params.role
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            orders: true,
          },
        },
      },
    }),
    prisma.user.count({ where }),
  ])

  return {
    users: users.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      orderCount: user._count.orders,
    })),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
}

/**
 * Get a single user by ID
 */
export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          orders: true,
        },
      },
    },
  })

  if (!user) {
    throw new NotFoundError('User not found')
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    orderCount: user._count.orders,
  }
}

/**
 * Update user role
 */
export async function updateUserRole(
  id: string,
  role: UserRole,
  currentUserId: string
): Promise<{ id: string; email: string; role: UserRole }> {
  // Prevent self-demotion
  if (id === currentUserId && role !== UserRole.ADMIN) {
    throw new Error('Cannot remove your own admin role')
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, role: true },
  })

  if (!user) {
    throw new NotFoundError('User not found')
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: { role },
    select: {
      id: true,
      email: true,
      role: true,
    },
  })

  logger.info('User role updated', {
    userId: id,
    oldRole: user.role,
    newRole: role,
    updatedBy: currentUserId,
  })

  return updatedUser
}

/**
 * Update user details (name, etc.)
 */
export async function updateUser(
  id: string,
  data: { name?: string }
): Promise<{ id: string; email: string; name: string | null }> {
  const user = await prisma.user.findUnique({
    where: { id },
  })

  if (!user) {
    throw new NotFoundError('User not found')
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      email: true,
      name: true,
    },
  })

  logger.info('User updated', { userId: id })

  return updatedUser
}

