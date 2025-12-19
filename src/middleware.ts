import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import { UserRole } from '@prisma/client'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
    const isAccountRoute = req.nextUrl.pathname.startsWith('/account')

    // Protect admin routes
    if (isAdminRoute) {
      if (!token) {
        return NextResponse.redirect(new URL('/auth/signin', req.url))
      }
      if (token.role !== UserRole.ADMIN) {
        return NextResponse.redirect(new URL('/', req.url))
      }
    }

    // Protect account routes
    if (isAccountRoute) {
      if (!token) {
        return NextResponse.redirect(new URL('/auth/signin', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
        const isAccountRoute = req.nextUrl.pathname.startsWith('/account')

        // Public routes don't need auth
        if (!isAdminRoute && !isAccountRoute) {
          return true
        }

        // Admin routes need admin role
        if (isAdminRoute) {
          return token?.role === UserRole.ADMIN
        }

        // Account routes need any authenticated user
        if (isAccountRoute) {
          return !!token
        }

        return true
      },
    },
  }
)

export const config = {
  matcher: ['/admin/:path*', '/account/:path*'],
}

