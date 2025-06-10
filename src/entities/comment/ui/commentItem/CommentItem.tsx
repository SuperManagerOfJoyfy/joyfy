import { Comment } from '@/entities/comment'
import { UserCard } from '@/entities/user'
import { Button, DateStamp } from '@/shared/ui'
import { FaRegHeart } from 'react-icons/fa'

import s from './CommentItem.module.scss'

// TODO: check avatars type

type Props = {
  comment: Comment
  onReplyClick?: () => void
}

export const CommentItem = ({ comment, onReplyClick }: Props) => {
  const {
    createdAt,
    isLiked,
    content,
    likeCount,
    from: { id: userId, username, avatars },
  } = comment
  const avatarUrl = avatars?.[0]?.url || ''
  const user = { id: userId, userName: username, avatar: avatarUrl }

  return (
    <div className={s.commentWrapper}>
      <div className={s.commentBody}>
        <UserCard user={user} layout="inline">
          {content}
        </UserCard>

        <div className={s.iconWrapper}>
          <FaRegHeart className={s.heartIcon} type="button" />
        </div>

        <div className={s.meta}>
          <div className={s.meta}>
            <DateStamp date={createdAt} />

            {isLiked && <span className={s.likes}>Like: {likeCount}</span>}

            <Button className={s.reply} onClick={onReplyClick} variant="text">
              Answer
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
