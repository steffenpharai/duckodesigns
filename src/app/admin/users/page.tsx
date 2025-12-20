import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { UserRole } from "@prisma/client"
import { getAllUsers } from "@/lib/users"
import { UsersListClient } from "@/components/admin/UsersListClient"

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: { page?: string; limit?: string; search?: string; role?: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== UserRole.ADMIN) {
    redirect("/")
  }

  const page = searchParams.page ? parseInt(searchParams.page) : 1
  const limit = searchParams.limit ? parseInt(searchParams.limit) : 50
  const search = searchParams.search || undefined
  const role = searchParams.role as UserRole | undefined

  const result = await getAllUsers({
    page,
    limit,
    search,
    role,
  })

  return (
    <div className="container py-12">
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold">Users</h1>
          <p className="text-muted-foreground mt-2">
            Manage user accounts and roles
          </p>
        </div>

        <UsersListClient
          initialUsers={result.users}
          initialTotal={result.total}
          initialPage={result.page}
          initialLimit={result.limit}
          initialTotalPages={result.totalPages}
        />
      </div>
    </div>
  )
}

