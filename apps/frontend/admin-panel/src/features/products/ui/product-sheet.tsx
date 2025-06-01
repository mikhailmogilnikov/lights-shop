import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { TrashIcon } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import type { ApiComponents } from '@/shared/api'
import { rqClient } from '@/shared/api'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/shared/ui/sheet'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form'

// Product validation schema
const productSchema = z.object({
  name: z.string().min(1),
  price: z.number().min(0),
  imageUrl: z.string().url(),
  stockQuantity: z.number().int().min(0),
})

export type ProductFormData = z.infer<typeof productSchema>

export function ProductSheet({
  open,
  setOpen,
  product,
  onSave,
}: {
  open: boolean
  setOpen: (openState: boolean) => void
  product: ApiComponents['Product'] | null
  onSave?: (data: ProductFormData) => void | Promise<void>
}) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{product ? 'Edit Product' : 'Create Product'}</SheetTitle>
          <SheetDescription>
            {product ? `ID: ${product.id}` : 'Fill in the product information'}
          </SheetDescription>
        </SheetHeader>

        <div className="py-4">
          <ProductForm
            product={product}
            onSave={onSave}
            onCancel={() => setOpen(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}

function ProductForm({
  product,
  onSave,
  onCancel,
}: {
  product: ApiComponents['Product'] | null
  onSave?: (data: ProductFormData) => void | Promise<void>
  onCancel?: () => void
}) {
  const queryClient = useQueryClient()

  const { mutate: deleteProduct } = rqClient.useMutation(
    'delete',
    '/admin/products/{id}',
    {
      onSuccess: () => {
        queryClient.invalidateQueries(
          rqClient.queryOptions('get', '/admin/products'),
        )
      },
    },
  )

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      price: product?.price || 0,
      imageUrl: product?.imageUrl || '',
      stockQuantity: product?.stockQuantity || 0,
    },
  })

  const onSubmit = async (data: ProductFormData) => {
    try {
      await onSave?.(data)
      onCancel?.()
    } catch (error) {
      console.error('Error saving product:', error)
    }
  }

  const handleDelete = () => {
    if (!product) return

    deleteProduct({
      params: {
        path: { id: product.id },
      },
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-4">
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {product && (
            <img
              className="size-40 object-cover rounded-md"
              src={product.imageUrl}
              alt={product.name}
            />
          )}

          <FormField
            control={form.control}
            name="stockQuantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    placeholder="0"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Saving...' : 'Save'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          {product && (
            <Button variant="destructive" onClick={handleDelete}>
              <TrashIcon className="size-4" />
              Delete
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}
