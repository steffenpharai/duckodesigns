import { getAllInventory, getLowStockItems } from "@/lib/inventory"
import { InventoryListClient } from "@/components/admin/InventoryListClient"

export default async function AdminInventoryPage() {
  const [inventory, lowStock] = await Promise.all([
    getAllInventory(),
    getLowStockItems(),
  ])

  return <InventoryListClient initialInventory={inventory} initialLowStock={lowStock} />
}
