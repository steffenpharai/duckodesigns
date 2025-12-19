import { getAllOrders } from "@/lib/orders"
import { OrderStatus } from "@prisma/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function AdminOrdersPage() {
  const { orders } = await getAllOrders()

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
    <div className="container py-12">
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold">Orders</h1>
          <p className="text-muted-foreground mt-2">
            Manage customer orders
          </p>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No orders yet</p>
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
                          <span className="font-medium">Customer:</span> {order.name} ({order.email})
                        </p>
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
                    </div>
                    <Button asChild variant="outline">
                      <Link href={`/admin/orders/${order.id}`}>View Details</Link>
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

