import * as ScrollArea from '@radix-ui/react-scroll-area'
import s from './scroll.module.scss'

type Props = React.ComponentPropsWithoutRef<typeof ScrollArea.Root> & {
  children: React.ReactNode
}

export const Scroll = ({ children }: Props) => {
  return (
    <ScrollArea.Root className={s.root}>
      <ScrollArea.Viewport className={s.viewport}>{children}</ScrollArea.Viewport>
      <ScrollArea.Scrollbar className={s.scrollbar} orientation="vertical">
        <ScrollArea.Thumb className={s.thumb} />
      </ScrollArea.Scrollbar>
      <ScrollArea.Scrollbar className={s.scrollbar} orientation="horizontal">
        <ScrollArea.Thumb className={s.thumb} />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  )
}
