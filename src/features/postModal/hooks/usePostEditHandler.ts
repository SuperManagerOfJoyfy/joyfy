import { useEditPostMutation } from '@/features/post/api/postsApi'
import { Post } from '@/features/post/types/postTypes'
import { extractMessage, isFetchBaseQueryError } from '@/shared/utils/handleErrors/handleErrors'
import { toast } from 'react-toastify'

type Props = {
  postId: number
  description: string
  onSuccess?: (updatedPost: Post) => void
}

export const usePostEditHandler = () => {
  const [editPost, { isLoading }] = useEditPostMutation()

  const handleEditPost = async ({ postId, description, onSuccess }: Props) => {
    try {
      const updatedPost = await editPost({ postId, description }).unwrap()
      onSuccess?.(updatedPost)
      toast.success('Post updated successfully!')
    } catch (error) {
      if (isFetchBaseQueryError(error)) {
        const message = extractMessage(error.data, 'Failed to update the post.')
        toast.error(message)
      } else if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('An unknown error occurred.')
      }
    }
  }
  return { handleEditPost, isLoading }
}
