import { Button, TextArea } from '@/shared/ui'
import s from './PostViewMode.module.scss'

export const PostCommentForm = () => {
  return (
    <div className={s.commentForm}>
      <TextArea placeholder="Add a Comment..." textAreaClassName={s.commentInput} />
      <Button variant="text">Publish</Button>
    </div>
  )
}
