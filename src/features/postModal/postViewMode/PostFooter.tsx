import { PostLikes } from '@/entities/post/ui/postLikes/ui/PostLikes'
import { useGetPostLikesQuery } from '@/features/post/api'
import { DateStamp, Separator } from '@/shared/ui'

import { usePostModalContext } from '../context/PostModalContext'
import { PostCommentForm } from './PostCommentForm'
import { PostReactions } from './PostReactions'
import s from './PostViewMode.module.scss'

export const PostFooter = () => {
  const { postId, currentPost } = usePostModalContext()
  const { createdAt } = currentPost

  const { data: likes } = useGetPostLikesQuery(postId)
  const users = likes?.items ?? []
  const count = likes?.totalCount ?? 0

  return (
    <>
      <PostReactions />

      {count > 0 && <PostLikes users={users} count={count} className={s.postLikes} />}

      <DateStamp date={createdAt} className={s.date} />

      <Separator />

      <PostCommentForm />
    </>
  )
}
