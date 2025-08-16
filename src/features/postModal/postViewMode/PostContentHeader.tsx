import { Post } from '@/features/post/types/postTypes'
import { DropdownMenu, UserCard } from '@/shared/ui'
import { HiDotsHorizontal } from 'react-icons/hi'
import { PostDropdownMenuItems } from './PostDropdownMenuItems'

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

export const PostContentHeader = ({
  post,
  isOwnPost,
  isFollowing,
  onEdit,
  onDelete,
  onFollowToggle,
  onCopyLink,
}: Props) => {
  const { ownerId, userName, avatarOwner } = post

  return (
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
  )
}
