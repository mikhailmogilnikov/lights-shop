import { createLink } from '@tanstack/react-router'

import { Button } from './button'
import type { ButtonProps } from './button'
import type { LinkComponent } from '@tanstack/react-router'

const BasicLinkButton = ({ children, ...props }: ButtonProps) => {
  return <Button {...props}>{children}</Button>
}

const CreatedLinkButton = createLink(BasicLinkButton)

export const LinkButton: LinkComponent<typeof BasicLinkButton> = (props) => {
  return <CreatedLinkButton preload={'intent'} {...props} />
}
