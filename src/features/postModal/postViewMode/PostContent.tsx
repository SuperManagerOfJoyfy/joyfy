import { Post } from '@/features/post/types/postTypes'
import { Scroll, Separator } from '@/shared/ui'
import { PostItem } from '@/entities/post/ui/postItem'
import { PostContentHeader } from './PostContentHeader'
import { PostFooter } from './PostFooter'
import { PostCommentList } from '@/features/comments/ui'

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

      <PostFooter postId={post.id} createdAt={post.createdAt} />
    </>
  )
}
