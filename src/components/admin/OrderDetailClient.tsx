"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { OrderStatus } from "@prisma/client"
import Image from "next/image"
import Link from "next/link"

type OrderWithRelations = Awaited<ReturnType<typeof import("@/lib/orders").getOrderById>>

interface OrderDetailClientProps {
  order: NonNullable<OrderWithRelations>
}

export function OrderDetailClient({ order: initialOrder }: OrderDetailClientProps) {
  const router = useRouter()
  const [order, setOrder] = useState(initialOrder)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [error, setError] = useState("")

  const [updateData, setUpdateData] = useState({
    status: order.status,
    name: order.name,
    email: order.email,
    phone: order.phone || "",
    childSize: order.childSize,
    productType: order.productType,
    fabricPreference: order.fabricPreference || "",
    personalization: order.personalization || "",
    deadline: order.deadline ? new Date(order.deadline).toISOString().split("T")[0] : "",
  })

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

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    setIsUpdating(true)
    setError("")

    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update order status")
      }

      const { order: updatedOrder } = await response.json()
      setOrder(updatedOrder)
      setUpdateData({ ...updateData, status: updatedOrder.status })
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    setError("")

    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...updateData,
          deadline: updateData.deadline ? new Date(updateData.deadline).toISOString() : null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update order")
      }

      const { order: updatedOrder } = await response.json()
      setOrder(updatedOrder)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    setError("")

    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete order")
      }

      router.push("/admin/orders")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const totalAmount = order.orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="container py-12 max-w-4xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Order Details</h1>
            <p className="text-muted-foreground mt-2">
              Order #{order.id.slice(0, 8)}
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/admin/orders">Back to Orders</Link>
          </Button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Order Status</CardTitle>
                <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Change Status</Label>
                <Select
                  value={order.status}
                  onValueChange={(value) => handleStatusUpdate(value as OrderStatus)}
                  disabled={isUpdating}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(OrderStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Created:</span>{" "}
                  {new Date(order.createdAt).toLocaleString()}
                </div>
                <div>
                  <span className="font-medium">Last Updated:</span>{" "}
                  {new Date(order.updatedAt).toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Name:</span> {order.name}
              </div>
              <div>
                <span className="font-medium">Email:</span>{" "}
                <a href={`mailto:${order.email}`} className="text-primary hover:underline">
                  {order.email}
                </a>
              </div>
              {order.phone && (
                <div>
                  <span className="font-medium">Phone:</span>{" "}
                  <a href={`tel:${order.phone}`} className="text-primary hover:underline">
                    {order.phone}
                  </a>
                </div>
              )}
              {order.user && (
                <div className="mt-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/users/${order.user.id}`}>
                      View Customer Account
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            {order.orderItems.length === 0 ? (
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Product Type:</span> {order.productType}
                </div>
                <div>
                  <span className="font-medium">Child Size:</span> {order.childSize}
                </div>
                {order.fabricPreference && (
                  <div>
                    <span className="font-medium">Fabric Preference:</span> {order.fabricPreference}
                  </div>
                )}
                {order.personalization && (
                  <div>
                    <span className="font-medium">Personalization:</span> {order.personalization}
                  </div>
                )}
                {order.carSeatFriendlyRequested && (
                  <div>
                    <span className="font-medium">Car Seat Friendly:</span> Yes
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded">
                    <div>
                      <div className="font-medium">
                        {item.product ? item.product.name : "Custom Product"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">
                        ${item.price.toFixed(2)} each
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-lg font-bold">${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {order.imageUrl && (
          <Card>
            <CardHeader>
              <CardTitle>Reference Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                <Image
                  src={order.imageUrl}
                  alt="Order reference image"
                  fill
                  className="object-contain"
                />
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Edit Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Customer Name</Label>
                  <Input
                    id="name"
                    value={updateData.name}
                    onChange={(e) => setUpdateData({ ...updateData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={updateData.email}
                    onChange={(e) => setUpdateData({ ...updateData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={updateData.phone}
                    onChange={(e) => setUpdateData({ ...updateData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="childSize">Child Size</Label>
                  <Input
                    id="childSize"
                    value={updateData.childSize}
                    onChange={(e) => setUpdateData({ ...updateData, childSize: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="productType">Product Type</Label>
                <Input
                  id="productType"
                  value={updateData.productType}
                  onChange={(e) => setUpdateData({ ...updateData, productType: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fabricPreference">Fabric Preference</Label>
                <Textarea
                  id="fabricPreference"
                  value={updateData.fabricPreference}
                  onChange={(e) => setUpdateData({ ...updateData, fabricPreference: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="personalization">Personalization</Label>
                <Textarea
                  id="personalization"
                  value={updateData.personalization}
                  onChange={(e) => setUpdateData({ ...updateData, personalization: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={updateData.deadline}
                  onChange={(e) => setUpdateData({ ...updateData, deadline: e.target.value })}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Update Order"}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  Delete Order
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this order? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

