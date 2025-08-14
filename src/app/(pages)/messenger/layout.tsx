import { ReactNode } from 'react'
import s from './MessengerLayout.module.scss'
import { SearchInput } from '@/features/messenger/ui/SearchInput'
import { ChatList } from '@/features/messenger/ui/ChatList'

export default function MessengerLayout({ children }: { children: ReactNode }) {
  return (
    <div className={s.container}>
      <aside className={s.sidebar}>
        <div className={s.searchBox}>
          <SearchInput />
        </div>
        <ChatList />
      </aside>
      <main className={s.mainContent}>{children}</main>
    </div>
  )
}
