import { AvatarGroup, Button, DateStamp, Separator, TextArea, TextField, Typography } from '@/shared/ui'
import { FaRegBookmark, FaRegHeart } from 'react-icons/fa'
import { FiSend } from 'react-icons/fi'

import s from './PostActions.module.scss'

type Props = {
  date: string
  postId: number
  likesCount: number
}

const avatars = ['', '', '']

export const PostActions = ({ postId, likesCount, date }: Props) => {
  return (
    <div className={s.postActions}>
      <div className={s.postActions__icons}>
        <div className={s.postActions__leftIcons}>
          <FaRegHeart type="button" className={s.icon} />
          <FiSend type="button" className={s.icon} />
        </div>

        <FaRegBookmark type="button" className={s.icon} />
      </div>

      {likesCount > 0 && (
        <div className={s.postActions__likes}>
          <AvatarGroup avatars={avatars} />
          <Typography as="span" variant="body2">
            {likesCount} <strong>"Like"</strong>
          </Typography>
        </div>
      )}

      <DateStamp date={date} className={s.postActions__date} />

      <Separator />

      <div className={s.postActions__commentForm}>
        <TextArea placeholder="Add a Comment..." className={s.commentInput} />
        <Button variant="text">Publish</Button>
      </div>
    </div>
  )
}
