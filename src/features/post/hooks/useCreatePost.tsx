import { useState } from 'react'
import { AspectRatioType, FilterType, ImageSettings } from '@/features/post/types/types'
import { useCreatePostMutation, useUploadImageMutation } from '../api/postsApi'

export const useCreatePost = () => {
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation()
  const [createPost, { isLoading: isCreating }] = useCreatePostMutation()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePublishPost = async (
    files: File[],
    description: string,
    imageSettings?: Record<number, ImageSettings>
  ) => {
    try {
      setIsLoading(true)
      setError(null)

      const uploadPromises = files.map(async (file) => {
        const formData = new FormData()
        formData.append('file', file)
        const response = await uploadImage(formData).unwrap()

        return response.images || []
      })
      const uploadResults = await Promise.all(uploadPromises)

      const uploadedImages = uploadResults.flat()

      if (uploadedImages.length === 0) {
        throw new Error('Failed to upload images')
      }

      const createPostData = {
        description,
        childrenMetadata: uploadedImages.map((img, index) => ({
          uploadId: img.uploadId,
          aspectRatio: imageSettings?.[index]?.aspectRatio,
          filter: imageSettings?.[index]?.filter,
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
