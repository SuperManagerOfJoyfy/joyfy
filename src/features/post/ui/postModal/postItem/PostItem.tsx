import Link from 'next/link'
import { FaRegHeart } from 'react-icons/fa'
import { Avatar, Button, Typography } from '@/shared/ui'
import { Post } from '@/features/post/types/types'
import { formatSmartDate } from '@/shared/utils/dateFunctions'

import s from './PostItem.module.scss'

type Props = {
  item: Post
  isComment?: boolean
  onReplyClick?: () => void
}

export const PostItem = ({ item, isComment = false, onReplyClick }: Props) => {
  const { ownerId, userName, description, createdAt, avatarOwner, likesCount, isLiked } = item
  return (
    <div className={s.postItem} data-type={isComment ? 'comment' : 'post'}>
      <Avatar avatar={avatarOwner} />
      <div className={s.postBody}>
        <Typography variant="body2">
          <Link href={`/profile/${ownerId}`} className={s.userName}>
            {userName}
          </Link>

          {description}
        </Typography>
        <div className={s.meta}>
          <span className={s.date}>{formatSmartDate(createdAt)}</span>

          {isComment && (
            <div className={s.iconWrapper}>
              <FaRegHeart className={s.heartIcon} type="button" />
            </div>
          )}

          {isComment && (
            <>
              {isLiked && <span className={s.likes}>Like: {likesCount}</span>}
              <Button className={s.reply} onClick={onReplyClick} variant="text">
                Answer
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
