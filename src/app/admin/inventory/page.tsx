import { getAllInventory, getLowStockItems } from "@/lib/inventory"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminInventoryPage() {
  const [inventory, lowStock] = await Promise.all([
    getAllInventory(),
    getLowStockItems(),
  ])

  return (
    <div className="container py-12">
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold">Inventory</h1>
          <p className="text-muted-foreground mt-2">
            Manage product inventory levels
          </p>
        </div>

        {lowStock.length > 0 && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-yellow-800">
                Low Stock Alert ({lowStock.length} items)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {lowStock.map((item) => (
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
                ))}
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

              return (
                <Card key={item.id} className={isLowStock ? "border-yellow-200" : ""}>
                  <CardHeader>
                    <CardTitle className="text-lg">{item.product.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Quantity</p>
                      <p className="text-2xl font-bold">{item.quantity}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Reserved</p>
                      <p className="text-lg">{item.reservedQuantity}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Available</p>
                      <p className={`text-lg font-semibold ${isLowStock ? "text-yellow-600" : ""}`}>
                        {available}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Low Stock Threshold</p>
                      <p className="text-sm">{item.lowStockThreshold}</p>
                    </div>
                    {isLowStock && (
                      <p className="text-xs text-yellow-600 font-medium">
                        ⚠️ Low stock warning
                      </p>
                    )}
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

