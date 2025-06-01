import { createFileRoute } from '@tanstack/react-router'
import { rqClient } from '@/shared/api'

export const Route = createFileRoute('/(admin)/_authenticated/orders')({
  component: RouteComponent,
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(rqClient.queryOptions('get', '/admin/orders')),
})

function RouteComponent() {
  const { data } = rqClient.useSuspenseQuery('get', '/admin/orders')

  return <div>{JSON.stringify(data)}</div>
}
