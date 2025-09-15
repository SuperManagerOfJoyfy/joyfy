import * as ScrollArea from '@radix-ui/react-scroll-area'
import clsx from 'clsx'
import { ComponentPropsWithoutRef, forwardRef } from 'react'
import s from './scroll.module.scss'

type Props = {
  children: React.ReactNode
  className?: string
} & ComponentPropsWithoutRef<typeof ScrollArea.Root>

export const Scroll = forwardRef<HTMLDivElement, Props>(({ children, className }, ref) => {
  return (
    <ScrollArea.Root className={clsx(s.root, className)}>
      <ScrollArea.Viewport className={s.viewport} ref={ref}>
        {children}
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar className={s.scrollbar} orientation="vertical">
        <ScrollArea.Thumb className={s.thumb} />
      </ScrollArea.Scrollbar>
      <ScrollArea.Scrollbar className={s.scrollbar} orientation="horizontal">
        <ScrollArea.Thumb className={s.thumb} />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  )
})
