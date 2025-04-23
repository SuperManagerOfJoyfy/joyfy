'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Loader } from '@/shared/ui/loader/Loader'
import { useCreatePostMutation } from '@/features/post/api/postApi'
import { CreatePostModal } from '@/features/post/ui/createPost/createPostModal'
import { AuthGuard } from '@/features/auth/ui'

export default function CreatePostPage() {
  const [isModalOpen, setIsModalOpen] = useState(true)
  const [createPost, { isLoading }] = useCreatePostMutation()
  const router = useRouter()

  const handleClose = useCallback(() => {
    setIsModalOpen(false)
    // Navigate back after modal closes
    router.back()
  }, [router])

  const handlePublish = useCallback(
    async (formData: FormData) => {
      try {
        await createPost(formData).unwrap()
        handleClose()
      } catch (error) {
        console.error('Failed to create post:', error)
        // You could add error handling/notification here
      }
    },
    [createPost, handleClose]
  )

  return (
    <AuthGuard requireAuth>
      {isLoading && <Loader message="Publishing..." />}
      <CreatePostModal
        open={isModalOpen}
        onClose={handleClose}
        onPublish={handlePublish}
      />
    </AuthGuard>
  )
}
