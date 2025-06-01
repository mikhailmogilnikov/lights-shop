import { cn } from '../lib/utils'
import type { ComponentProps } from 'react'

export function Container({
  children,
  className,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div className={cn('p-4 max-w-6xl mx-auto', className)} {...props}>
      {children}
    </div>
  )
}
