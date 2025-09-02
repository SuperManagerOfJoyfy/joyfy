import { Post } from '@/features/post/types/postTypes'
import { PostCommentList } from '@/features/comments/ui/PostCommentList'
import { PostFooter } from '@/features/postModal/postViewMode'
import { Scroll, Separator, PostItem, UserCard } from '@/shared/ui'

import s from './PublicPostModal.module.scss'

type Props = {
  post: Post
}

export const PublicPostContent = ({ post }: Props) => {
  const { id: postId, ownerId, userName, avatarOwner, createdAt } = post

  const user = {
    id: ownerId,
    userName,
    avatar: avatarOwner,
  }

  // const { data: likes } = useGetPostLikesQuery(postId)

  // const users = likes?.items ?? []
  // const count = likes?.totalCount ?? 0

  return (
    <div className={s.contentWrapper}>
      <div className={s.header}>
        <UserCard user={user} />
      </div>

      <Separator />

      <Scroll className={s.scroll}>
        <PostItem post={post} />
        <PostCommentList postId={post.id} />
      </Scroll>

      <Separator />

      <PostFooter createdAt={createdAt} post={post} />
    </div>
  )
}
