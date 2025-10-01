import { useDeletePostMutation } from '@/features/post/api/postsApi'
import { useFollowUserByIdMutation, useUnfollowUserByIdMutation } from '@/features/profile/api'
import { useTranslations } from 'next-intl'
import { useCallback } from 'react'
import { toast } from 'react-toastify'

type Props = {
  userId: number
  postId: number
  ownerId: number
  isFollowing: boolean
  setIsEditing: (isEditing: boolean) => void
}

export const usePostDropdownMenuActions = ({ userId, postId, ownerId, isFollowing, setIsEditing }: Props) => {
  const [deletePost] = useDeletePostMutation()
  const [followById, { isLoading: followIsLoading }] = useFollowUserByIdMutation()
  const [unfollow, { isLoading: unfollowIsLoading }] = useUnfollowUserByIdMutation()

  const t = useTranslations('postEditForm')

  const handleEdit = useCallback(() => {
    setIsEditing(true)
  }, [setIsEditing])

  const handleDelete = useCallback(async () => {
    try {
      await deletePost({ postId, userId })
      toast.success(t('deleteSuccess'))
    } catch (error) {
      toast.error(t('deleteError'))
    }
  }, [postId, deletePost])

  const handleFollowToggle = useCallback(() => {
    if (isFollowing) {
      unfollow(userId)
    } else {
      followById(userId)
    }
  }, [isFollowing, ownerId])

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href)
    toast.success(t('copySuccess'))
  }, [postId])

  return {
    handleEdit,
    handleDelete,
    handleFollowToggle,
    handleCopyLink,
  }
}
