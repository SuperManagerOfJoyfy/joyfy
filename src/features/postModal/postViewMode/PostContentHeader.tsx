import { Post } from '@/features/post/types/postTypes'
import { UserCard } from '@/shared/ui'
import { usePostModalContext } from '../context/PostModalContext'
import { OwnPostDropdownMenu } from './OwnPostDropdownMenu'
import { PublicPostDropdownMenu } from './PublicPostDropdownMenu'
import s from './PostViewMode.module.scss'

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
    </div>
  )
}
