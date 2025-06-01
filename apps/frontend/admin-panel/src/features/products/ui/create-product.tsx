import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { PlusIcon } from 'lucide-react'
import { ProductSheet } from './product-sheet'
import type { ProductFormData } from './product-sheet'
import { rqClient } from '@/shared/api'
import { Button } from '@/shared/ui/button'

export function CreateProductButton() {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const { mutate: createProduct } = rqClient.useMutation(
    'post',
    '/admin/products',
    {
      onSuccess: () => {
        setOpen(false)
        queryClient.invalidateQueries(
          rqClient.queryOptions('get', '/admin/products'),
        )
      },
    },
  )

  const handleSave = (savedProduct: ProductFormData) => {
    console.log(savedProduct)
    createProduct({
      body: { ...savedProduct, category: 'lamp', description: 'test' },
    })
  }

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <PlusIcon className="size-4" />
        Create Product
      </Button>
      <ProductSheet
        open={open}
        setOpen={setOpen}
        product={null}
        onSave={handleSave}
      />
    </>
  )
}
