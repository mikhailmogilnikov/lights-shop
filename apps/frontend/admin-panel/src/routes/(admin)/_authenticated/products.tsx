import { createFileRoute } from '@tanstack/react-router'
import { rqClient } from '@/shared/api'

export const Route = createFileRoute('/(admin)/_authenticated/products')({
  component: RouteComponent,
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(
      rqClient.queryOptions('get', '/admin/products'),
    ),
})

function RouteComponent() {
  const { data } = rqClient.useSuspenseQuery('get', '/admin/products')

  return <div>{JSON.stringify(data)}</div>
}
