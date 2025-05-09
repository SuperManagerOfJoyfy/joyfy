import { useCallback } from 'react'

type Props = {
  postId: number
  ownerId: number
  isFollowing: boolean
}

export const usePostDropdownMenuActions = ({ postId, ownerId, isFollowing }: Props) => {
  const handleEdit = useCallback(() => {
    console.log('edit')
  }, [])
  const handleDelete = useCallback(() => {
    console.log('delete')
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
