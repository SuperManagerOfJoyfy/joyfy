import { CommentItem, Comment } from '@/entities/comment'

type Props = {
  comments: Comment[]
}

export const PostCommentList = ({ comments }: Props) => {
  return (
    <>
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </>
  )
}
