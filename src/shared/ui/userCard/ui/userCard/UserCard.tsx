import { Avatar } from '@/shared/ui'
import { formatChatTimestamp } from '@/shared/utils/dateFunctions'
import clsx from 'clsx'
import Link from 'next/link'
import { User } from '../../types/userCard.types'
import s from './UserCard.module.scss'

type Props = {
  user: User
  className?: string
  layout?: 'standalone' | 'inline' | 'stacked' //  'standalone' for use in headers, 'inline' - inside comments/posts, 'stacked' - messages
  date?: string
  children?: React.ReactNode
}

export const UserCard = ({ user, className, date, layout = 'standalone', children }: Props) => {
  const { avatar, id, userName } = user
  return (
    <div className={clsx(s.userInfo, s[layout], className)}>
      <Avatar avatar={avatar} name={userName} />
      <div className={s.textBlock}>
        <div className={s.headerRow}>
          <Link href={`/profile/${id}`} className={s.userName}>
            {userName}
          </Link>
          {layout === 'stacked' && <span className={s.timeStamp}>{formatChatTimestamp(date ?? '')}</span>}
        </div>
        <p className={s.childrenText}> {children}</p>
      </div>
    </div>
  )
}
