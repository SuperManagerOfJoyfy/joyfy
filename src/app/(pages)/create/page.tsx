'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Loader } from '@/shared/ui/loader/Loader'
import { CreatePostModal } from '@/features/post/ui/createPost/createPostModal'
import { AuthGuard } from '@/features/auth/ui'
import { useCreatePost } from '@/features/post/hooks/useCreatePost'
import { AspectRatioType, FilterType } from '@/features/post/types/types'

type PublishData = {
  files: File[]
  description: string
  aspectRatio?: AspectRatioType
  filter?: FilterType
  zoom?: number
}

export default function CreatePostPage() {
  const [isModalOpen, setIsModalOpen] = useState(true)
  const router = useRouter()
  const { handlePublishPost, isLoading, error } = useCreatePost()

  const handleClose = useCallback(() => {
    setIsModalOpen(false)
    router.back()
  }, [router])

  const handlePublish = useCallback(
    (formData: PublishData) => {
      try {
        const { files, description, aspectRatio, filter, zoom } = formData
        handlePublishPost(files, description, aspectRatio, filter)
          .then(() => handleClose())
          .catch((error) => console.error('Failed to create post:', error))
      } catch (error) {
        console.error('Failed to create post:', error)
      }
    },
    [handlePublishPost, handleClose]
  )

  return (
    <AuthGuard requireAuth>
      {isLoading && <Loader message="Publish..." />}
      {error && <div className="text-red-500">{error}</div>}
      <CreatePostModal open={isModalOpen} onClose={handleClose} onPublish={handlePublish} />
    </AuthGuard>
  )
}
