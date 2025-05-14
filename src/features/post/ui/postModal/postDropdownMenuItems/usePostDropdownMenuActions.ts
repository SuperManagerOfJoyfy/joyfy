import { useDeletePostMutation } from '@/features/post/api/postsApi'
import { useCallback } from 'react'
import { toast } from 'react-toastify'

type Props = {
  postId: number
  ownerId: number
  isFollowing: boolean
  setIsEditing: (isEditing: boolean) => void
}

export const usePostDropdownMenuActions = ({ postId, ownerId, isFollowing, setIsEditing }: Props) => {
  const [deletePost] = useDeletePostMutation()

  const handleEdit = useCallback(() => {
    setIsEditing(true)
  }, [])

  const handleDelete = useCallback(async () => {
    try {
      await deletePost({ postId })
      toast.success('Post deleted successfully.')
    } catch (error) {
      toast.error('Something went wrong')
    }
  }, [postId])

  const handleFollowToggle = useCallback(() => {
    if (isFollowing) {
      console.log('Unfollow')
    } else {
      console.log('Follow')
    }
  }, [isFollowing, ownerId])

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`)
  }, [postId])

  return {
    handleEdit,
    handleDelete,
    handleFollowToggle,
    handleCopyLink,
  }
}
