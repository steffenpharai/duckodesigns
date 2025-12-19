import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { UserRole } from "@prisma/client"
import { getAllOrders } from "@/lib/orders"
import { getAllProducts } from "@/lib/products"
import { getAllInventory, getLowStockItems } from "@/lib/inventory"
import { OrderStatus } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== UserRole.ADMIN) {
    redirect("/")
  }

  const [ordersData, products, inventory, lowStock] = await Promise.all([
    getAllOrders(),
    getAllProducts(),
    getAllInventory(),
    getLowStockItems(),
  ])

  const orders = ordersData.orders
  const pendingOrders = orders.filter((o) => o.status === OrderStatus.PENDING)
  const inProgressOrders = orders.filter((o) => o.status === OrderStatus.IN_PROGRESS)
  const completedOrders = orders.filter((o) => o.status === OrderStatus.COMPLETED)

  // Calculate revenue (sum of product prices for completed orders)
  const revenue = completedOrders.reduce((sum, order) => {
    const orderTotal = order.orderItems.reduce((itemSum, item) => {
      return itemSum + item.price * item.quantity
    }, 0)
    return sum + orderTotal
  }, 0)

  const stats = [
    {
      title: "Total Orders",
      value: orders.length,
      description: `${pendingOrders.length} pending`,
    },
    {
      title: "In Progress",
      value: inProgressOrders.length,
      description: "Active orders",
    },
    {
      title: "Completed",
      value: completedOrders.length,
      description: "Finished orders",
    },
    {
      title: "Total Revenue",
      value: `$${revenue.toFixed(2)}`,
      description: "From completed orders",
    },
    {
      title: "Products",
      value: products.length,
      description: "Total products",
    },
    {
      title: "Low Stock",
      value: lowStock.length,
      description: "Items need restocking",
    },
  ]

  return (
    <div className="container py-12">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Overview of your store operations
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {orders.slice(0, 5).length === 0 ? (
                <p className="text-sm text-muted-foreground">No orders yet</p>
              ) : (
                <div className="space-y-2">
                  {orders.slice(0, 5).map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {order.name} - {order.productType}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          order.status === OrderStatus.PENDING
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === OrderStatus.COMPLETED
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Low Stock Items</CardTitle>
            </CardHeader>
            <CardContent>
              {lowStock.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  All items are well stocked
                </p>
              ) : (
                <div className="space-y-2">
                  {lowStock.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.quantity} in stock
                        </p>
                      </div>
                      <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-800">
                        Low Stock
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

