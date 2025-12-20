"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { OrderStatus } from "@prisma/client"
import Link from "next/link"

type OrderWithRelations = Awaited<ReturnType<typeof import("@/lib/orders").getAllOrders>>["orders"][0]

interface OrdersListClientProps {
  initialOrders: OrderWithRelations[]
}

export function OrdersListClient({ initialOrders }: OrdersListClientProps) {
  const router = useRouter()
  const [orders] = useState(initialOrders)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL")
  const [dateFilter, setDateFilter] = useState("")

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
        return "bg-yellow-100 text-yellow-800"
    }
  }

  const filteredOrders = orders.filter((order) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesSearch =
        order.name.toLowerCase().includes(query) ||
        order.email.toLowerCase().includes(query) ||
        order.productType.toLowerCase().includes(query) ||
        order.id.toLowerCase().includes(query)
      if (!matchesSearch) return false
    }

    // Status filter
    if (statusFilter !== "ALL" && order.status !== statusFilter) {
      return false
    }

    // Date filter
    if (dateFilter) {
      const orderDate = new Date(order.createdAt).toISOString().split("T")[0]
      if (orderDate !== dateFilter) {
        return false
      }
    }

    return true
  })

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No orders yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <Input
          placeholder="Search by name, email, product, or order ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as OrderStatus | "ALL")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            {Object.values(OrderStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {status.replace("_", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="w-[180px]"
          placeholder="Filter by date"
        />
        {dateFilter && (
          <Button variant="outline" onClick={() => setDateFilter("")}>
            Clear Date
          </Button>
        )}
      </div>

      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No orders found matching your filters</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
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
  )
}

