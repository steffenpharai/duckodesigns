import { getOrderById } from "@/lib/orders"
import { redirect } from "next/navigation"
import { OrderDetailClient } from "@/components/admin/OrderDetailClient"

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const order = await getOrderById(params.id)

  if (!order) {
    redirect("/admin/orders")
  }

  return <OrderDetailClient order={order} />
}

