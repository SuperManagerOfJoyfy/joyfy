'use client'

import { useMemo } from 'react'
import { Tabs } from '@/shared/ui'
import { Tab } from '@/shared/ui/tabs'
import { GeneralInformation } from '../generalInformation/GeneralInformation'
import { MyPayments } from '../myPayments'
import { Management } from '@/features/profile/ui/management/Management'
import { Devices } from '@/features/profile/ui/devices/Devices'
import { useRouter } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

import s from './ProfileSettings.module.scss'

type ProfileSettingsProps = {
  activePart: string
}

const SETTINGS_TABS = [
  { value: 'info' as const },
  { value: 'devices' as const },
  { value: 'management' as const },
  { value: 'payments' as const },
]

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
  const t = useTranslations('profileSettings.tabs')

  const tabs: Tab[] = useMemo(
    () =>
      SETTINGS_TABS.map(({ value }) => ({
        value,
        title: t(value),
      })),
    [t]
  )

  const handleTabChange = (value: string) => {
    router.push(`?part=${value}`, { scroll: false })
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
