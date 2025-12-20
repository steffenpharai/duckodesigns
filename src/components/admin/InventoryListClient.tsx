"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

type InventoryItem = Awaited<ReturnType<typeof import("@/lib/inventory").getAllInventory>>[0]

interface InventoryListClientProps {
  initialInventory: InventoryItem[]
  initialLowStock: InventoryItem[]
}

export function InventoryListClient({ initialInventory, initialLowStock }: InventoryListClientProps) {
  const { toast } = useToast()
  const [inventory, setInventory] = useState(initialInventory)
  const [lowStock] = useState(initialLowStock)
  const [editing, setEditing] = useState<Record<string, { quantity?: number; threshold?: number }>>({})
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({})
  const [error, setError] = useState("")

  const handleEdit = (itemId: string, field: "quantity" | "threshold", value: number) => {
    setEditing({
      ...editing,
      [itemId]: {
        ...editing[itemId],
        [field]: value,
      },
    })
  }

  const handleUpdate = async (item: InventoryItem) => {
    const edits = editing[item.id]
    if (!edits || (!edits.quantity && edits.threshold === undefined)) {
      return
    }

    setIsUpdating({ ...isUpdating, [item.id]: true })
    setError("")

    try {
      const updates: Record<string, unknown> = {}
      if (edits.quantity !== undefined) {
        updates.quantity = edits.quantity
      }
      if (edits.threshold !== undefined) {
        updates.lowStockThreshold = edits.threshold
      }

      const response = await fetch(`/api/inventory/${item.productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update inventory")
      }

      const { inventory: updatedInventory } = await response.json()
      setInventory(
        inventory.map((inv) =>
          inv.id === item.id ? { ...inv, ...updatedInventory } : inv
        )
      )

      // Clear editing state
      const newEditing = { ...editing }
      delete newEditing[item.id]
      setEditing(newEditing)
      toast({
        title: "Inventory updated",
        description: "The inventory has been successfully updated.",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsUpdating({ ...isUpdating, [item.id]: false })
    }
  }

  const handleAddStock = async (item: InventoryItem, amount: number) => {
    if (amount <= 0) return

    setIsUpdating({ ...isUpdating, [item.id]: true })
    setError("")

    try {
      const response = await fetch(`/api/inventory/${item.productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quantity: item.quantity + amount,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update inventory")
      }

      const { inventory: updatedInventory } = await response.json()
      setInventory(
        inventory.map((inv) =>
          inv.id === item.id ? { ...inv, ...updatedInventory } : inv
        )
      )
      toast({
        title: "Stock added",
        description: `Added ${amount} units to inventory.`,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsUpdating({ ...isUpdating, [item.id]: false })
    }
  }

  return (
    <div className="container py-12">
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold">Inventory</h1>
          <p className="text-muted-foreground mt-2">
            Manage product inventory levels
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
            {error}
          </div>
        )}

        {lowStock.length > 0 && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-yellow-800">
                Low Stock Alert ({lowStock.length} items)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {lowStock.map((item) => {
                  const available = item.quantity - item.reservedQuantity
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2 bg-white rounded"
                    >
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} available, {item.reservedQuantity} reserved
                        </p>
                      </div>
                      <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-800">
                        Low Stock
                      </span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {inventory.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No inventory items yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {inventory.map((item) => {
              const available = item.quantity - item.reservedQuantity
              const isLowStock = available <= item.lowStockThreshold
              const isEditing = !!editing[item.id]
              const isUpdatingItem = isUpdating[item.id]

              return (
                <Card key={item.id} className={isLowStock ? "border-yellow-200" : ""}>
                  <CardHeader>
                    <CardTitle className="text-lg">{item.product.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Quantity</p>
                      {isEditing ? (
                        <Input
                          type="number"
                          min="0"
                          value={editing[item.id]?.quantity ?? item.quantity}
                          onChange={(e) =>
                            handleEdit(item.id, "quantity", parseInt(e.target.value) || 0)
                          }
                          disabled={isUpdatingItem}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-2xl font-bold">{item.quantity}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Reserved</p>
                      <p className="text-lg">{item.reservedQuantity}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Available</p>
                      <p
                        className={`text-lg font-semibold ${isLowStock ? "text-yellow-600" : ""}`}
                      >
                        {available}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Low Stock Threshold</p>
                      {isEditing ? (
                        <Input
                          type="number"
                          min="0"
                          value={editing[item.id]?.threshold ?? item.lowStockThreshold}
                          onChange={(e) =>
                            handleEdit(
                              item.id,
                              "threshold",
                              parseInt(e.target.value) || 0
                            )
                          }
                          disabled={isUpdatingItem}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-sm">{item.lowStockThreshold}</p>
                      )}
                    </div>
                    {isLowStock && (
                      <p className="text-xs text-yellow-600 font-medium">
                        ⚠️ Low stock warning
                      </p>
                    )}

                    <div className="flex gap-2 pt-2">
                      {isEditing ? (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleUpdate(item)}
                            disabled={isUpdatingItem}
                            className="flex-1"
                          >
                            {isUpdatingItem ? "Updating..." : "Save"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const newEditing = { ...editing }
                              delete newEditing[item.id]
                              setEditing(newEditing)
                            }}
                            disabled={isUpdatingItem}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setEditing({
                                ...editing,
                                [item.id]: {},
                              })
                            }
                            className="flex-1"
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAddStock(item, 10)}
                            disabled={isUpdatingItem}
                          >
                            +10
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

