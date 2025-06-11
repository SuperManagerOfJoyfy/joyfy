import { AvatarGroup, Button, DateStamp, Separator, TextArea, Typography } from '@/shared/ui'
import { FaRegBookmark, FaRegHeart } from 'react-icons/fa'
import { FiSend } from 'react-icons/fi'
import { useGetPostLikesQuery } from '@/features/post/api'
import s from './PostViewMode.module.scss'

type Props = {
  date: string
  postId: number
  likesCount: number
}

export const PostActions = ({ likesCount, date, postId }: Props) => {
  const { data } = useGetPostLikesQuery(postId)
  const users = data?.items ?? []

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
          <AvatarGroup users={users} />
          <Typography as="span" variant="body2">
            {likesCount} <strong>"Like"</strong>
          </Typography>
        </div>
      )}

      <DateStamp date={date} className={s.postActions__date} />

      <Separator />

      <div className={s.postActions__commentForm}>
        <TextArea placeholder="Add a Comment..." textAreaClassName={s.commentInput} />
        <Button variant="text">Publish</Button>
      </div>
    </div>
  )
}
