import { useDeletePostMutation } from '@/features/post/api/postsApi'
import { useFollowUserByIdMutation, useUnfollowUserByIdMutation } from '@/features/profile/api'
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

  const handleEdit = useCallback(() => {
    setIsEditing(true)
  }, [setIsEditing])

  const handleDelete = useCallback(async () => {
    try {
      await deletePost({ postId, userId })
      toast.success('Post deleted successfully.')
    } catch (error) {
      toast.error('Post cannot be deleted')
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
    toast.success('Link copied to clipboard')
  }, [postId])

  return {
    handleEdit,
    handleDelete,
    handleFollowToggle,
    handleCopyLink,
  }
}
