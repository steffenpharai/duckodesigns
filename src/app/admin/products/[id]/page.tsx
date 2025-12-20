import { getProductById } from "@/lib/products"
import { redirect } from "next/navigation"
import { ProductEditForm } from "@/components/admin/ProductEditForm"

export default async function EditProductPage({
  params,
}: {
  params: { id: string }
}) {
  const product = await getProductById(params.id)

  if (!product) {
    redirect("/admin/products")
  }

  return <ProductEditForm product={product} />
}

