import { Typography } from '@/shared/ui'
import { ChatList } from './ChatList'
import { InputBox } from './InputBox'
import s from './Messenger.module.scss'

export const Messenger = () => {
  return (
    <div className={s.messenger}>
      <Typography variant="h1">Messenger</Typography>
      <div className={s.container}>
        <aside className={s.sidebar}>
          <div className={s.searchBox}>{/*<SearchInput />*/}</div>
          <ChatList />
        </aside>

        <section className={s.chatArea}>
          <header className={s.chatHeader}></header>
          <div className={s.chatBody}>
            {/*<Banner />*/}
            {/* <ChatWindow /> */}
          </div>

          <footer className={s.chatFooter}>{/*<InputBox />*/}</footer>
        </section>
      </div>
    </div>
  )
}
