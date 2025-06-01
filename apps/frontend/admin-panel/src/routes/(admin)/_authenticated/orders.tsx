import { createFileRoute } from '@tanstack/react-router'
import { rqClient } from '@/shared/api'
import { OrdersTable } from '@/features/orders/ui/orders-table'

export const Route = createFileRoute('/(admin)/_authenticated/orders')({
  component: RouteComponent,
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(rqClient.queryOptions('get', '/admin/orders')),
})

function RouteComponent() {
  const { data } = rqClient.useSuspenseQuery('get', '/admin/orders')

  return <OrdersTable data={data} />
}
