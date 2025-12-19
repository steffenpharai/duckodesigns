import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { getOrderById } from "@/lib/orders"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

interface OrderDetailPageProps {
  params: {
    id: string
  }
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/auth/signin")
  }

  const order = await getOrderById(params.id)

  if (!order) {
    notFound()
  }

  // Users can only view their own orders
  if (order.userId !== session.user.id && session.user.role !== "ADMIN") {
    redirect("/account/orders")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800"
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800"
      case "CONFIRMED":
        return "bg-purple-100 text-purple-800"
      case "CANCELLED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container py-12 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold">Order Details</h1>
          <p className="text-muted-foreground mt-2">
            Order #{order.id.slice(0, 8)}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <span
                  className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Product Type</p>
                <p className="font-medium">{order.productType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Child Size</p>
                <p className="font-medium">{order.childSize}</p>
              </div>
              {order.deadline && (
                <div>
                  <p className="text-sm text-muted-foreground">Needed By</p>
                  <p className="font-medium">
                    {new Date(order.deadline).toLocaleDateString()}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Order Date</p>
                <p className="font-medium">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{order.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{order.email}</p>
              </div>
              {order.phone && (
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{order.phone}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {order.fabricPreference && (
          <Card>
            <CardHeader>
              <CardTitle>Fabric Preference</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{order.fabricPreference}</p>
            </CardContent>
          </Card>
        )}

        {order.personalization && (
          <Card>
            <CardHeader>
              <CardTitle>Personalization Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{order.personalization}</p>
            </CardContent>
          </Card>
        )}

        {order.carSeatFriendlyRequested && (
          <Card>
            <CardHeader>
              <CardTitle>Special Request</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Car-seat friendly design requested
              </p>
            </CardContent>
          </Card>
        )}

        {order.imageUrl && (
          <Card>
            <CardHeader>
              <CardTitle>Reference Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-square max-w-md">
                <Image
                  src={order.imageUrl}
                  alt="Order reference image"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

