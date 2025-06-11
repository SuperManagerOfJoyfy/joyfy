import { Post } from '@/features/post/types/postTypes'
import { Scroll, Separator } from '@/shared/ui'

import { Comment } from '@/entities/comment'
import { CommentList } from './CommentList'

import { PostContentHeader } from './PostContentHeader'
import { PostItem } from '@/entities/post/ui/postItem'
import { PostActions } from './PostActions'
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

export const PostViewContent = ({
  post,
  isOwnPost,
  isFollowing,
  onEdit,
  onDelete,
  onFollowToggle,
  onCopyLink,
}: Props) => {
  //TODO: add GetCommentsByPostIdQuery
  // const { data: comments = [], isLoading } = useGetCommentsByPostIdQuery(post.id)
  const comments: Comment[] = []
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
        <CommentList comments={comments} />
      </Scroll>

      <Separator />
      <PostActions postId={post.id} date={post.createdAt} likesCount={post.likesCount} />
    </>
  )
}
