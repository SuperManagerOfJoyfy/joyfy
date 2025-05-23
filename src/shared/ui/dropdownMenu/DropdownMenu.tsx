import { ComponentPropsWithoutRef, ComponentRef, ReactNode, forwardRef } from 'react'

import * as RadixDropdownMenu from '@radix-ui/react-dropdown-menu'

import s from './DropdownMenu.module.scss'

type DropdownMenuProps = {
  align?: 'center' | 'end' | 'start'
  children: ReactNode
  sideOffset?: number
  trigger: ReactNode
} & ComponentPropsWithoutRef<typeof RadixDropdownMenu.Root>

export const DropdownMenu = forwardRef<ComponentRef<typeof RadixDropdownMenu.Trigger>, DropdownMenuProps>(
  ({ align = 'end', children, sideOffset = 8, trigger, ...rest }, ref) => {
    return (
      <RadixDropdownMenu.Root {...rest}>
        <RadixDropdownMenu.Trigger className={s.trigger} asChild={typeof trigger !== 'string'} ref={ref}>
          {trigger}
        </RadixDropdownMenu.Trigger>
        <RadixDropdownMenu.Content align={align} className={s.content} sideOffset={sideOffset}>
          {children}
        </RadixDropdownMenu.Content>
      </RadixDropdownMenu.Root>
    )
  }
)
