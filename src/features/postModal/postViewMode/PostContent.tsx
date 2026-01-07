import { PostCommentList } from '@/features/comments/ui'
import { Post } from '@/features/post/types/postTypes'
import { PostItem, Scroll, Separator } from '@/shared/ui'
import { PostContentHeader } from './PostContentHeader'
import { PostFooter } from './PostFooter'

import s from './PostViewMode.module.scss'

type Props = {
  post: Post
  isOwnPost: boolean
  isFollowing: boolean
  onEdit: () => void
  onDelete: () => void
  onFollowToggle: () => void
  onCopyLink: () => void
}

export const PostContent = ({ post, isOwnPost, isFollowing, onEdit, onDelete, onFollowToggle, onCopyLink }: Props) => {
  return (
    <>
      <PostContentHeader
        post={post}
        isOwnPost={isOwnPost}
        isFollowing={isFollowing}
        onEdit={onEdit}
        onDelete={onDelete}
        onFollowToggle={onFollowToggle}
        onCopyLink={onCopyLink}
      />

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
