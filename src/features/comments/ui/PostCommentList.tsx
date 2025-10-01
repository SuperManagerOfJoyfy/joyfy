import { Loader } from '@/shared/ui'
import { sortCommentsByUserPriority } from '../utils'
import { useGetCommentsQuery } from '../api/commentsApi'
import { CommentItem } from './CommentItem'
import { Comment } from '../api/commentsApi.types'
import { useTranslations } from 'next-intl'

type PostCommentListProps = {
  comments?: Comment[]
  postId: number
  userId?: number
}

export const PostCommentList = ({ comments: propComments, postId, userId }: PostCommentListProps) => {
  const t = useTranslations('comments')
  const { data: commentsData, isLoading } = useGetCommentsQuery(
    {
      postId,
      pageSize: 10,
      pageNumber: 1,
      sortBy: 'createdAt',
      sortDirection: 'desc',
    },
    { skip: !postId }
  )

  const comments = propComments || commentsData?.items || []
  const sortedComments = sortCommentsByUserPriority(comments, userId)

  if (isLoading) return <Loader message={t('loading')} />

  return (
    <>
      {sortedComments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} postId={postId} />
      ))}
    </>
  )
}
