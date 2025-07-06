import { ComponentPropsWithoutRef, ComponentRef, ReactNode, forwardRef } from 'react'

import * as RadixDropdownMenu from '@radix-ui/react-dropdown-menu'

import s from './DropdownMenu.module.scss'
import clsx from 'clsx'

type DropdownMenuProps = {
  align?: 'center' | 'end' | 'start'
  children: ReactNode
  sideOffset?: number
  trigger: ReactNode
  contentClassName?: string
} & ComponentPropsWithoutRef<typeof RadixDropdownMenu.Root>

export const DropdownMenu = forwardRef<ComponentRef<typeof RadixDropdownMenu.Trigger>, DropdownMenuProps>(
  ({ align = 'end', children, sideOffset = 8, trigger, contentClassName, ...rest }, ref) => {
    return (
      <RadixDropdownMenu.Root {...rest}>
        <RadixDropdownMenu.Trigger className={s.trigger} asChild={typeof trigger !== 'string'} ref={ref}>
          {trigger}
        </RadixDropdownMenu.Trigger>

        <RadixDropdownMenu.Content align={align} className={clsx(s.content, contentClassName)} sideOffset={sideOffset}>
          {children}
        </RadixDropdownMenu.Content>
      </RadixDropdownMenu.Root>
    )
  }
)

export const DropdownMenuArrow = () => {
  return <RadixDropdownMenu.Arrow className={s.arrow} />
}
