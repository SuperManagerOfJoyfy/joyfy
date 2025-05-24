import Link from 'next/link'
import { Avatar } from '@/shared/ui'
import s from './UserCard.module.scss'
import clsx from 'clsx'

export type User = {
  id: number
  userName: string
  avatar?: string
}

type Props = {
  user: User
  className?: string
}

export const UserCard = ({ user, className }: Props) => {
  const { avatar, id, userName } = user
  return (
    <div className={clsx(s.userInfo, className)}>
      <Avatar avatar={avatar} />
      <Link href={`/profile/${id}`} className={s.userName}>
        {userName}
      </Link>
    </div>
  )
}
