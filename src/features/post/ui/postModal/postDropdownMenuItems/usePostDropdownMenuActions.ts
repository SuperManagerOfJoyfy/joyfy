import { useCallback } from 'react'
import { useDeletePostMutation } from '@/features/post/api/postsApi'
import { toast } from 'react-toastify'

type Props = {
  postId: number
  ownerId: number
  isFollowing: boolean
}

export const usePostDropdownMenuActions = ({ postId, ownerId, isFollowing }: Props) => {
  const [deletePost] = useDeletePostMutation()

  const handleEdit = useCallback(() => {
    console.log('edit')
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
