import { createFileRoute } from '@tanstack/react-router'
import { rqClient } from '@/shared/api'
import { ProductsTable } from '@/features/products/ui/products-table'

export const Route = createFileRoute('/(admin)/_authenticated/products')({
  component: RouteComponent,
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(
      rqClient.queryOptions('get', '/admin/products'),
    ),
})

function RouteComponent() {
  const { data } = rqClient.useSuspenseQuery('get', '/admin/products')

  return <ProductsTable data={data} />
}
