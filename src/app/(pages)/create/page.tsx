'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Loader } from '@/shared/ui/loader/Loader'
import { CreatePostModal } from '@/features/post/ui/createPost/createPostModal'
import { AuthGuard } from '@/features/auth/ui'
import { useCreatePost } from '@/features/post/hooks/useCreatePost'
import { PublishData } from '@/features/post/types/types'
import { toast } from 'react-toastify'
import { useAuth } from '@/features/auth/hooks/useAuth'

export default function CreatePostPage() {
  const [isModalOpen, setIsModalOpen] = useState(true)
  const router = useRouter()
  const { handlePublishPost, isLoading, error } = useCreatePost()
  const { user } = useAuth()
  const userId = user?.userId

  const handleClose = useCallback(() => {
    setIsModalOpen(false)
    router.back()
  }, [router])

  const handlePublish = useCallback(
    async (formData: PublishData) => {
      try {
        const { files, description, imageSettings } = formData

        const aspectRatio = imageSettings[0]?.aspectRatio
        const filter = imageSettings[0]?.filter

        await handlePublishPost(files, description, aspectRatio, filter)
        toast.success('Post created successfully!')
        router.push(`/profile/${userId}`)
        return true
      } catch (error) {
        console.error('Failed to create post:', error)
        toast.error('Failed to create post. Please try again.')
        throw error
      }
    },
    [handlePublishPost, router]
  )

  return (
    <AuthGuard requireAuth>
      {isLoading && <Loader message="Publishing..." />}
      {error && <div className="text-red-500">{error}</div>}
      <CreatePostModal open={isModalOpen} onClose={handleClose} onPublish={handlePublish} />
    </AuthGuard>
  )
}
