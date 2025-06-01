import { createFileRoute } from '@tanstack/react-router'
import { LoginForm } from '@/features/auth/ui/login-form'

export const Route = createFileRoute('/auth/_public/sign-in')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <LoginForm className="w-full max-w-md" />
    </div>
  )
}
