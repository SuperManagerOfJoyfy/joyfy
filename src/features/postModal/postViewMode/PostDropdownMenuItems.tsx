import { BiEditAlt, BiTrash, BiCopy } from 'react-icons/bi'
import { RiUserUnfollowLine, RiUserFollowLine } from 'react-icons/ri'
import { DropdownMenuItem } from '@/shared/ui'
import { useTranslations } from 'next-intl'

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
  const t = useTranslations('postEditForm.menu')

  if (isOwnPost) {
    return (
      <>
        <DropdownMenuItem onSelect={onEdit}>
          <BiEditAlt /> {t('edit')}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onDelete}>
          <BiTrash /> {t('delete')}
        </DropdownMenuItem>
      </>
    )
  }

  return (
    <>
      <DropdownMenuItem onSelect={onFollowToggle}>
        {isFollowing ? (
          <span>
            <RiUserUnfollowLine /> {t('unfollow')}
          </span>
        ) : (
          <span>
            <RiUserFollowLine /> {t('follow')}
          </span>
        )}
      </DropdownMenuItem>
      <DropdownMenuItem onSelect={onCopyLink}>
        <BiCopy /> {t('copyLink')}
      </DropdownMenuItem>
    </>
  )
}
