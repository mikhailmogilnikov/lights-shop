import { useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { ProductSheet } from './product-sheet'
import type { ProductFormData } from './product-sheet'
import type { ApiComponents } from '@/shared/api'
import { rqClient } from '@/shared/api'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table'

export function ProductsTable({
  data,
}: {
  data: Array<ApiComponents['Product']>
}) {
  const [selectedProduct, setSelectedProduct] = useState<
    ApiComponents['Product'] | null
  >(null)
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const { mutate: updateProduct } = rqClient.useMutation(
    'put',
    '/admin/products/{id}',
    {
      onSuccess: () => {
        setOpen(false)
        queryClient.invalidateQueries(
          rqClient.queryOptions('get', '/admin/products'),
        )
      },
    },
  )

  const sortedProducts = useMemo(() => {
    return data.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
  }, [data])

  const handleRowClick = (product: ApiComponents['Product']) => {
    setSelectedProduct(product)
    setOpen(true)
  }

  const handleSave = (savedProduct: ProductFormData) => {
    if (!selectedProduct) return

    updateProduct({
      params: {
        path: { id: selectedProduct.id },
      },
      body: savedProduct,
    })
  }

  return (
    <>
      <ProductSheet
        open={open}
        setOpen={setOpen}
        product={selectedProduct}
        onSave={handleSave}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-4 w-24">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="pr-4">Stock</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedProducts.map((product) => (
            <TableRow
              key={product.id}
              onClick={() => handleRowClick(product)}
              className="cursor-pointer"
            >
              <TableCell className="pl-4">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  width={50}
                  height={50}
                  className="rounded-md"
                />
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>
                {new Date(product.createdAt).toLocaleString()}
              </TableCell>
              <TableCell>
                {product.price.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                })}
              </TableCell>
              <TableCell className="pr-4">{product.stockQuantity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
