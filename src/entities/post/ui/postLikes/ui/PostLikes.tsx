import { AvatarGroup, Typography } from '@/shared/ui'
import s from './PostLikes.module.scss'
import clsx from 'clsx'
import { AvatarUser } from '@/shared/ui/userCard'

type Props = {
  users: AvatarUser[]
  count: number
  className?: string
}

export const PostLikes = ({ users, count, className }: Props) => {
  return (
    <div className={clsx(s.likesWrapper, className)}>
      <AvatarGroup users={users} />
      <Typography as="span" variant="body2">
        {count} <strong>"Like"</strong>
      </Typography>
    </div>
  )
}
