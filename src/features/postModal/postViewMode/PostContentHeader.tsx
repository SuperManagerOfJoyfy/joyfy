import { Post } from '@/features/post/types/postTypes'
import { DropdownMenu, UserCard } from '@/shared/ui'
import { HiDotsHorizontal } from 'react-icons/hi'
import { PostDropdownMenuItems } from './PostDropdownMenuItems'

import s from './PostViewMode.module.scss'
import { OwnPostDropdownMenu } from './OwnPostDropdownMenu'
import { PublicPostDropdownMenu } from './PublicPostDropdownMenu'
import { usePostModalContext } from '../context/PostModalContext'

type Props = {
  post: Post
}

export const PostContentHeader = ({ post }: Props) => {
  const { ownerId, userName, avatarOwner } = post
  const { isFollowing, isOwnPost, handleEdit, handleConfirmDelete } = usePostModalContext()

  return (
    <div className={s.contentHeader}>
      <UserCard user={{ id: ownerId, userName, avatar: avatarOwner }} />
      {isOwnPost ? (
        <OwnPostDropdownMenu onEdit={handleEdit} onDelete={handleConfirmDelete} />
      ) : (
        <PublicPostDropdownMenu postId={post.id} ownerId={post.ownerId} isFollowing={isFollowing} />
      )}
      {/* <DropdownMenu trigger={<HiDotsHorizontal />}>
        <PostDropdownMenuItems
          isOwnPost={isOwnPost}
          isFollowing={isFollowing}
          onEdit={onEdit}
          onDelete={onDelete}
          onFollowToggle={onFollowToggle}
          onCopyLink={onCopyLink}
        />
      </DropdownMenu> */}
    </div>
  )
}
