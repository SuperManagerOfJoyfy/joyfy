import { UserCard } from '@/shared/user'
import { InputBox } from './InputBox'
import s from './ChatArea.module.scss'

export const ChatArea = () => {
  return (
    <div className={s.chatArea}>
      <header className={s.chatHeader}>{/* <UserCard user={user} /> */}</header>
      <div className={s.chatBody}></div>

      <footer className={s.chatFooter}>
        <InputBox />
      </footer>
    </div>
  )
}
