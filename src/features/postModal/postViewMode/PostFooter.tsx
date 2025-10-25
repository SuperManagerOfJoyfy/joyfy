import { PostLikes } from '@/entities/post/ui/postLikes/ui/PostLikes'
import { PostCommentForm } from '@/features/comments/ui/PostCommentForm'
import { Post } from '@/features/post/types/postTypes'
import { DateStamp, Separator } from '@/shared/ui'
import { useTranslations } from 'next-intl'
import { PostReactions } from './PostReactions'

import { usePostLike } from '@/features/post/hooks'
import s from './PostViewMode.module.scss'

type PostFooterProps = {
  createdAt: string
  post: Post
}

export const PostFooter = ({ createdAt, post }: PostFooterProps) => {
  const { likes, count, myLike, changeLikeStatus } = usePostLike(post.id)

  const t = useTranslations('post')

  return (
    <div className={s.stickyFooter}>
      <PostReactions myLike={myLike} changeLikeStatus={changeLikeStatus} post={post} />
      {count > 0 && <PostLikes users={likes} count={count} className={s.postLikes} />}
      <DateStamp date={createdAt} className={s.date} />
      <Separator />
      <PostCommentForm postId={post.id} />
    </div>
  )
}
