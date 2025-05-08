import * as RadixTabs from '@radix-ui/react-tabs'
import clsx from 'clsx'
import s from './tabs.module.scss'

export type Tab = {
  disabled?: boolean
  title: string
  value: string
}

type Props = {
  className?: string
  defaultValue?: string
  tabs: Tab[]
}

export function Tabs({ className, defaultValue, tabs }: Props) {
  return (
    <RadixTabs.Root className={s.root} defaultValue={defaultValue}>
      <RadixTabs.List className={s.tabList}>
        {tabs.map((tab) => (
          <RadixTabs.Trigger
            className={clsx(s.tab, className)}
            disabled={tab.disabled}
            key={tab.value}
            value={tab.value}
          >
            {tab.title}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
    </RadixTabs.Root>
  )
}
