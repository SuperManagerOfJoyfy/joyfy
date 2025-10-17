import { PostCommentList } from '@/features/comments/ui'
import { Post } from '@/features/post/types/postTypes'
import { PostItem, Scroll, Separator } from '@/shared/ui'
import { PostContentHeader } from './PostContentHeader'
import { PostFooter } from './PostFooter'

import s from './PostViewMode.module.scss'

type Props = {
  post: Post
}

export const PostContent = ({ post }: Props) => {
  return (
    <>
      <PostContentHeader post={post} />

      <Separator />

      <Scroll className={s.scrollArea}>
        <PostItem post={post} />
        <PostCommentList postId={post.id} />
      </Scroll>

      <Separator />

      <PostFooter createdAt={post.createdAt} post={post} />
    </>
  )
}
