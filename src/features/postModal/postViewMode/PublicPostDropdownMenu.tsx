import { HiDotsHorizontal } from 'react-icons/hi'
import { BiCopy } from 'react-icons/bi'
import { RiUserFollowLine, RiUserUnfollowLine } from 'react-icons/ri'
import { useTranslations } from 'next-intl'
import { DropdownMenu, DropdownMenuItem } from '@/shared/ui'
import { useFollowUserByIdMutation, useUnfollowUserByIdMutation } from '@/features/profile/api'
import { toast } from 'react-toastify'

type PublicPostDropdownMenuProps = {
  postId: number
  ownerId: number
  isFollowing: boolean
}

export const PublicPostDropdownMenu = ({ postId, ownerId, isFollowing }: PublicPostDropdownMenuProps) => {
  const t = useTranslations('postEditForm.menu')

  const [followById] = useFollowUserByIdMutation()
  const [unfollow] = useUnfollowUserByIdMutation()

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await unfollow(ownerId).unwrap()
      } else {
        await followById(ownerId).unwrap()
      }
    } catch (error) {
      console.error('Follow action failed:', error)
    }
  }

  const handleCopyLink = () => {
    const url = `${window.location.origin}/post/${postId}`
    navigator.clipboard.writeText(url)
    toast.success(t('copySuccess'))
  }

  return (
    <DropdownMenu trigger={<HiDotsHorizontal />}>
      <DropdownMenuItem onSelect={handleFollowToggle}>
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

      <DropdownMenuItem onSelect={handleCopyLink}>
        <BiCopy /> {t('copyLink')}
      </DropdownMenuItem>
    </DropdownMenu>
  )
}
