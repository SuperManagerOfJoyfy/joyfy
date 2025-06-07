import { Post } from '@/features/post/types/postTypes'
import { PostActions, PostDropdownMenuItems, PostItem } from '@/features/post/ui/postModal'
import { DropdownMenu, Scroll, Separator, UserCard } from '@/shared/ui'
import { HiDotsHorizontal } from 'react-icons/hi'
import s from './PostDisplay.module.scss'

type Props = {
  post: Post
  isOwnPost: boolean
  isFollowing: boolean
  onEdit: () => void
  onDelete: () => void
  onFollowToggle: () => void
  onCopyLink: () => void
}

export const PostDisplay = ({ post, isOwnPost, isFollowing, onEdit, onDelete, onFollowToggle, onCopyLink }: Props) => {
  const { userName, ownerId, avatarOwner, likesCount, id: postId, createdAt } = post

  return (
    <>
      <div className={s.contentHeader}>
        <UserCard user={{ id: ownerId, userName, avatar: avatarOwner }} />
        <DropdownMenu trigger={<HiDotsHorizontal />}>
          <PostDropdownMenuItems
            isOwnPost={isOwnPost}
            isFollowing={isFollowing}
            onEdit={onEdit}
            onDelete={onDelete}
            onFollowToggle={onFollowToggle}
            onCopyLink={onCopyLink}
          />
        </DropdownMenu>
      </div>
      <Separator />
      <Scroll className={s.scrollArea}>
        <PostItem item={post} />
      </Scroll>
      <Separator />
      <PostActions likesCount={likesCount} postId={postId} date={createdAt} />
    </>
  )
}
