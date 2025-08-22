import { ReactNode } from 'react'
import s from './MessengerLayout.module.scss'
import { SearchInput } from '@/features/messenger/ui/SearchInput'
import { ChatList } from '@/features/messenger/ui/ChatList'

import { AuthGuard } from '@/features/auth/ui'
import { Typography } from '@/shared/ui'

type Props = { children: ReactNode }

export default async function MessengerLayout({ children }: Props) {
  return (
    <AuthGuard requireAuth>
      <Typography variant="h1">Messenger</Typography>
      <div className={s.container}>
        <aside className={s.sidebar}>
          <div className={s.searchBox}>
            <SearchInput />
          </div>
          <ChatList />
        </aside>
        <main className={s.mainContent}>{children}</main>
      </div>
    </AuthGuard>
  )
}
