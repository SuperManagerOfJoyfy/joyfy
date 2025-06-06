import { BiEditAlt, BiTrash, BiCopy } from 'react-icons/bi'
import { RiUserUnfollowLine, RiUserFollowLine } from 'react-icons/ri'
import { DropdownMenuItem } from '@/shared/ui'

type Props = {
  isOwnPost: boolean
  isFollowing: boolean
  onEdit?: () => void
  onDelete?: () => void
  onFollowToggle?: () => void
  onCopyLink?: () => void
}

export const PostDropdownMenuItems = ({
  isOwnPost,
  isFollowing,
  onEdit,
  onDelete,
  onFollowToggle,
  onCopyLink,
}: Props) => {
  if (isOwnPost) {
    return (
      <>
        <DropdownMenuItem onSelect={onEdit}>
          <BiEditAlt /> Edit Post
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onDelete}>
          <BiTrash /> Delete Post
        </DropdownMenuItem>
      </>
    )
  }

  return (
    <>
      <DropdownMenuItem onSelect={onFollowToggle}>
        {isFollowing ? (
          <span>
            <RiUserUnfollowLine /> Unfollow
          </span>
        ) : (
          <span>
            <RiUserFollowLine /> Follow
          </span>
        )}
      </DropdownMenuItem>
      <DropdownMenuItem onSelect={onCopyLink}>
        <BiCopy /> Copy Link
      </DropdownMenuItem>
    </>
  )
}
