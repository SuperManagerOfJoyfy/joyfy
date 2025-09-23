import { Avatar } from '@/shared/ui'
import { formatChatTimestamp } from '@/shared/utils/dateFunctions'
import clsx from 'clsx'
import Link from 'next/link'
import { User } from '../../types/userCard.types'
import s from './UserCard.module.scss'
import { PATH } from '@/shared/config/routes'

type Props = {
  user: User
  className?: string
  layout?: 'standalone' | 'inline' | 'stacked' | 'withDate' //  'standalone' for use in headers, 'inline' - inside comments/posts, 'stacked' - userSearch, 'withDate' - messenger
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
          <Link href={`${PATH.USER.PROFILE}/${id}`} className={s.userName}>
            {userName}
          </Link>
          {layout === 'withDate' && <span className={s.timeStamp}>{formatChatTimestamp(date ?? '')}</span>}
        </div>
        <p className={s.childrenText}> {children}</p>
      </div>
    </div>
  )
}
