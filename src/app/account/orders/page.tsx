import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getOrdersByUserId } from "@/lib/orders"
import { OrderStatus } from "@prisma/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function OrdersPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/auth/signin")
  }

  const orders = await getOrdersByUserId(session.user.id)

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.COMPLETED:
        return "bg-green-100 text-green-800"
      case OrderStatus.IN_PROGRESS:
        return "bg-blue-100 text-blue-800"
      case OrderStatus.CONFIRMED:
        return "bg-purple-100 text-purple-800"
      case OrderStatus.CANCELLED:
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container py-12 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold">My Orders</h1>
          <p className="text-muted-foreground mt-2">
            View all your order history
          </p>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No orders yet</p>
              <Button asChild>
                <Link href="/custom-order">Place Your First Order</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">
                          Order #{order.id.slice(0, 8)}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="grid gap-2 text-sm text-muted-foreground">
                        <p>
                          <span className="font-medium">Product:</span> {order.productType}
                        </p>
                        <p>
                          <span className="font-medium">Size:</span> {order.childSize}
                        </p>
                        {order.deadline && (
                          <p>
                            <span className="font-medium">Needed by:</span>{" "}
                            {new Date(order.deadline).toLocaleDateString()}
                          </p>
                        )}
                        <p>
                          <span className="font-medium">Ordered:</span>{" "}
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {order.personalization && (
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Notes:</span> {order.personalization}
                        </p>
                      )}
                    </div>
                    <Button asChild variant="outline">
                      <Link href={`/account/orders/${order.id}`}>View Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

