'use client'

import { useRouter } from 'next/navigation'
import { useMemo } from 'react'

import { Tabs } from '@/shared/ui'
import { Tab } from '@/shared/ui/tabs'
import { GeneralInformation } from '../generalInformation/GeneralInformation'
import { PATH } from '@/shared/config/routes'
import { MyPayments } from '../myPayments'

import s from './ProfileSettings.module.scss'
import { Management } from '@/features/profile/ui/management/Management'
import { Devices } from '@/features/profile/ui/devices/Devices'

type ProfileSettingsProps = {
  activePart: string
}

const SETTINGS_TABS = [
  {
    value: 'info',
    title: 'General Information',
    href: `${PATH.USER.SETTINGS}?part=info`,
  },
  {
    value: 'devices',
    title: 'Devices',
    href: `${PATH.USER.SETTINGS}?part=devices`,
  },
  {
    value: 'management',
    title: 'Account Management',
    href: `${PATH.USER.SETTINGS}?part=management`,
  },
  {
    value: 'payments',
    title: 'My Payments',
    href: `${PATH.USER.SETTINGS}?part=payments`,
  },
] as const

type SettingsTabValue = (typeof SETTINGS_TABS)[number]['value']

const renderTabContent = (activePart: string) => {
  switch (activePart as SettingsTabValue) {
    case 'info':
      return <GeneralInformation />
    case 'devices':
      return <Devices />
    case 'management':
      return <Management />
    case 'payments':
      return <MyPayments />
    default:
      return <GeneralInformation />
  }
}

export const ProfileSettings = ({ activePart }: ProfileSettingsProps) => {
  const router = useRouter()
  const tabs: Tab[] = useMemo(() => SETTINGS_TABS.map(({ value, title }) => ({ value, title })), [])

  const tabHrefs = useMemo(() => Object.fromEntries(SETTINGS_TABS.map(({ value, href }) => [value, href])), [])

  const handleTabChange = (value: string) => {
    const href = tabHrefs[value]
    if (href) {
      router.push(href)
    }
  }

  return (
    <div className={s.container}>
      <div className={s.tabsWrapper}>
        <Tabs tabs={tabs} value={activePart} onValueChange={handleTabChange} />

        <div className={s.tabContent}>{renderTabContent(activePart)}</div>
      </div>
    </div>
  )
}
