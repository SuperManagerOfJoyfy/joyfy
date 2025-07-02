import * as ScrollArea from '@radix-ui/react-scroll-area'
import s from './scroll.module.scss'
import clsx from 'clsx'
import { forwardRef } from 'react'

type Props = React.ComponentPropsWithoutRef<typeof ScrollArea.Root> & {
  children: React.ReactNode
  className?: string
}

export const Scroll = forwardRef<HTMLDivElement, Props>(({ children, className }, ref) => {
  return (
    <ScrollArea.Root className={clsx(s.root, className)}>
      <ScrollArea.Viewport ref={ref} className={s.viewport}>
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
