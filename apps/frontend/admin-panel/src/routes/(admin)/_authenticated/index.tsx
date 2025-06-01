import { createFileRoute } from '@tanstack/react-router'
import { rqClient } from '@/shared/api'
import { Container } from '@/shared/ui/container'
import { DashboardStats } from '@/features/dashboard/ui/stats'

export const Route = createFileRoute('/(admin)/_authenticated/')({
  component: App,

  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(
      rqClient.queryOptions('get', '/admin/dashboard'),
    ),
})

function App() {
  const { data } = rqClient.useSuspenseQuery('get', '/admin/dashboard')

  return (
    <Container>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <DashboardStats data={data} />
    </Container>
  )
}
