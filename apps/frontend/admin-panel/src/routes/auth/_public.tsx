import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/_public')({
  component: RouteComponent,
  beforeLoad: ({ context: { session } }) => {
    if (session) {
      throw redirect({ to: '/' })
    }
  },
})

function RouteComponent() {
  return <Outlet />
}
