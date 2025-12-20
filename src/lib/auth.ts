import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from './db'
import { UserRole } from '@prisma/client'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          // Check if user exists, create if not
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          })

          if (!existingUser) {
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name || null,
                role: UserRole.CUSTOMER,
              },
            })
          }
          return true
        } catch (error) {
          console.error('Error during sign in:', error)
          return false
        }
      }
      return true
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        // Fetch latest user data to ensure role is up to date
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { id: true, email: true, name: true, role: true },
          })

          if (dbUser) {
            session.user.id = dbUser.id
            session.user.email = dbUser.email
            session.user.name = dbUser.name
            session.user.role = dbUser.role
          } else {
            // Fallback to token if user not found
            session.user.id = token.id as string
            session.user.role = token.role as UserRole
          }
        } catch (error) {
          console.error('Error fetching user in session callback:', error)
          // Fallback to token values
          session.user.id = token.id as string
          session.user.role = token.role as UserRole
        }
      }
      return session
    },
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        // Fetch user from database to get latest role
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email! },
            select: { id: true, role: true },
          })

          if (dbUser) {
            token.id = dbUser.id
            token.role = dbUser.role
          } else {
            token.id = user.id
            token.role = UserRole.CUSTOMER
          }
        } catch (error) {
          console.error('Error fetching user in JWT callback:', error)
          token.id = user.id
          token.role = UserRole.CUSTOMER
        }
      }
      return token
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

