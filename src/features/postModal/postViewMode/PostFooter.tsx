import { useGetPostLikesQuery } from '@/features/post/api'
import { PostReactions } from './PostReactions'
import { PostLikes } from '@/entities/post/ui/postLikes/ui/PostLikes'
import { DateStamp, Separator } from '@/shared/ui'

import { PostCommentForm } from '@/features/comments/ui/PostCommentForm'

import s from './PostViewMode.module.scss'

type PostFooterProps = {
  postId: number
  createdAt: string
}

export const PostFooter = ({ postId, createdAt }: PostFooterProps) => {
  const { data: likes } = useGetPostLikesQuery(postId)

  const users = likes?.items ?? []
  const count = likes?.totalCount ?? 0

  return (
    <div className={s.stickyFooter}>
      <PostReactions />

      {count > 0 && <PostLikes users={users} count={count} className={s.postLikes} />}

      <DateStamp date={createdAt} className={s.date} />

      <Separator />

      <PostCommentForm postId={postId} />
    </div>
  )
}
