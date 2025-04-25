import { useState } from 'react'
import { AspectRatioType, FilterType } from '@/features/post/types/types'
import { useCreatePostMutation, useUploadImageMutation } from '../api/postsApi'

export const useCreatePost = () => {
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation()
  const [createPost, { isLoading: isCreating }] = useCreatePostMutation()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePublishPost = async (
    files: File[],
    description: string,
    aspectRatio?: AspectRatioType,
    filter?: FilterType
  ) => {
    try {
      setIsLoading(true)
      setError(null)

      const uploadedImages = []

      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)

        const response = await uploadImage(formData).unwrap()

        if (response.images && response.images.length > 0) {
          uploadedImages.push(...response.images)
        }
      }

      if (uploadedImages.length === 0) {
        throw new Error('Failed to upload images')
      }

      const createPostData = {
        description,
        childrenMetadata: uploadedImages.map((img) => ({
          uploadId: img.uploadId,
        })),
      }

      const result = await createPost(createPostData).unwrap()
      return result
    } catch (err) {
      console.error('Error creating post:', err)
      setError(err instanceof Error ? err.message : 'Failed to create post')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    handlePublishPost,
    isLoading: isLoading || isUploading || isCreating,
    error,
  }
}
