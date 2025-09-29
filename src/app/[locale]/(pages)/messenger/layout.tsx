import { ReactNode } from 'react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { AuthGuard } from '@/features/auth/ui'
import { Typography } from '@/shared/ui'
import { Sidebar } from '@/features/messenger/ui'
import s from './MessengerLayout.module.scss'

type Props = {
  children: ReactNode
  params: { locale: string; dialoguePartnerId?: string }
}

export default async function MessengerLayout({ children, params }: Props) {
  const { locale } = params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'messenger' })

  return (
    <AuthGuard requireAuth>
      <Typography variant="h1">{t('title')}</Typography>
      <div className={s.container}>
        <Sidebar />
        <main className={s.mainContent}>{children}</main>
      </div>
    </AuthGuard>
  )
}
