import { useLocation, useNavigate } from '@tanstack/react-router'
import { HEADER_PATHS } from '../model/header-paths'
import { LinkButton } from '@/shared/ui/link-button'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/button'
import { useSession } from '@/shared/model/session'

export function Header() {
  const { href } = useLocation()
  const { logout } = useSession()
  const navigate = useNavigate()

  return (
    <header className="flex sticky top-0 z-10 bg-background items-center justify-between h-14 shrink-0 border-b border-border px-4">
      <div className="flex items-center gap-8">
        <h1 className="text-lg font-bold">Light Shop Admin</h1>
        <div className="flex items-center gap-2">
          {HEADER_PATHS.map((path) => (
            <LinkButton
              variant="ghost"
              size="sm"
              key={path.path}
              to={path.path}
              className={cn(href !== path.path && 'opacity-50')}
            >
              {path.label}
            </LinkButton>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            logout()
            navigate({ to: '/auth/sign-in' })
          }}
        >
          Logout
        </Button>
      </div>
    </header>
  )
}
