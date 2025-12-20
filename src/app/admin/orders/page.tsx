import { getAllOrders } from "@/lib/orders"
import { OrdersListClient } from "@/components/admin/OrdersListClient"

export default async function AdminOrdersPage() {
  const { orders } = await getAllOrders()

  return (
    <div className="container py-12">
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold">Orders</h1>
          <p className="text-muted-foreground mt-2">
            Manage customer orders
          </p>
        </div>

        <OrdersListClient initialOrders={orders} />
      </div>
    </div>
  )
}
