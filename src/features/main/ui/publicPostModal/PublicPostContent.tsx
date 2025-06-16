import { UserCard } from '@/entities/user'
import { PostLikes } from '@/entities/post/ui/postLikes/ui/PostLikes'
import { Post } from '@/features/post/types/postTypes'
import { useGetPostLikesQuery } from '@/features/post/api'
import { DateStamp, Scroll, Separator } from '@/shared/ui'
import { PostItem } from '@/entities/post/ui/postItem'
import { PostCommentList } from '@/features/postModal/postViewMode'
import { Comment } from '@/entities/comment'
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

  const { data: likes } = useGetPostLikesQuery(postId)
  const users = likes?.items ?? []
  const count = likes?.totalCount ?? 0

  //TODO: add GetCommentsByPostIdQuery
  // const { data: comments = [], isLoading } = useGetCommentsByPostIdQuery(post.id)
  const comments: Comment[] = []

  return (
    <div className={s.contentWrapper}>
      <div className={s.header}>
        <UserCard user={user} />
      </div>

      <Separator />

      <Scroll className={s.scroll}>
        <PostItem post={post} />
        <PostCommentList comments={comments} />
      </Scroll>

      <Separator />

      <div className={s.footer}>
        {count > 0 && <PostLikes users={users} count={count} />}

        <DateStamp date={createdAt} />
      </div>
    </div>
  )
}
