import { ReactNode } from 'react'
import { AuthGuard } from '@/features/auth/ui'
import { Typography } from '@/shared/ui'
import { Sidebar } from '@/features/messenger/ui'

import s from './MessengerLayout.module.scss'

type Props = { children: ReactNode }

export default async function MessengerLayout({ children }: Props) {
  return (
    <AuthGuard requireAuth>
      <Typography variant="h1">Messenger</Typography>
      <div className={s.container}>
        <Sidebar />
        <main className={s.mainContent}>{children}</main>
      </div>
    </AuthGuard>
  )
}
