import { Post } from '@/features/post/types/postTypes'
import { DateStamp } from '@/shared/ui'
import { UserCard } from '@/shared/ui/userCard'

import s from './PostItem.module.scss'

type Props = {
  post: Post
}

export const PostItem = ({ post }: Props) => {
  const { ownerId, userName, description, createdAt, avatarOwner } = post
  const user = { id: ownerId, userName, avatar: avatarOwner }
  return (
    <div className={s.postWrapper}>
      <div className={s.postBody}>
        <UserCard user={user} layout="inline">
          {description}
        </UserCard>
        <DateStamp date={createdAt} className={s.date} />
      </div>
    </div>
  )
}
