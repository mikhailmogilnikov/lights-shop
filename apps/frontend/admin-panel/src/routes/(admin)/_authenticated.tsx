import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { Header } from '@/features/header/ui/Header'

export const Route = createFileRoute('/(admin)/_authenticated')({
  component: RouteComponent,
  beforeLoad: ({ context: { session } }) => {
    console.log('session', session)
    if (!session) {
      throw redirect({
        to: '/auth/sign-in',
        search: { redirect: location.href },
      })
    }
  },
})

function RouteComponent() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}
