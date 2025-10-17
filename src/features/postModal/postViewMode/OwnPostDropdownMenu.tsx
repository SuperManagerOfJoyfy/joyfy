import { HiDotsHorizontal } from 'react-icons/hi'
import { BiCopy } from 'react-icons/bi'
import { RiUserFollowLine, RiUserUnfollowLine } from 'react-icons/ri'
import { FiEdit, FiTrash2 } from 'react-icons/fi'
import { useTranslations } from 'next-intl'
import { DropdownMenu, DropdownMenuItem } from '@/shared/ui'
import { useDeletePostMutation } from '@/features/post/api'
import { useFollowUserByIdMutation, useUnfollowUserByIdMutation } from '@/features/profile/api'
import { toast } from 'react-toastify'

type PostDropdownMenuProps = {
  onEdit: () => void
  onDelete: () => void
}

export const OwnPostDropdownMenu = ({ onEdit, onDelete }: PostDropdownMenuProps) => {
  const t = useTranslations('postEditForm.menu')

  return (
    <DropdownMenu trigger={<HiDotsHorizontal />}>
      <DropdownMenuItem onSelect={onEdit}>
        <FiEdit /> {t('edit')}
      </DropdownMenuItem>
      <DropdownMenuItem onSelect={onDelete}>
        <FiTrash2 /> {t('delete')}
      </DropdownMenuItem>
    </DropdownMenu>
  )
}
