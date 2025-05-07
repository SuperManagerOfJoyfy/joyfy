import Link from 'next/link'
import s from './UserCard.module.scss'

import { Avatar } from '../avatar/Avatar'

type User = {
  id: number
  userName: string
  avatar?: string | null
}

type Props = {
  user: User
}

export const UserCard = ({ user }: Props) => {
  const { avatar, id, userName } = user
  return (
    <div className={s.userInfo}>
      <Avatar avatar={avatar} variant="userCard" />
      <Link href={`/profile/${id}`} className={s.userName}>
        {userName}
      </Link>
    </div>
  )
}
