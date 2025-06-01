import { useLocation } from '@tanstack/react-router'
import { CreateProductButton } from '@/features/products/ui/create-product'

export function HeaderRouteActions() {
  const { href } = useLocation()

  return <>{href === '/products' && <CreateProductButton />}</>
}
