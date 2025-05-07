'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

import { CreatePostModal } from '@/features/post/ui/createPost/createPostModal'
import { AuthGuard } from '@/features/auth/ui'
import { useAuth } from '@/features/auth/hooks/useAuth'

export default function CreatePostPage() {
  const [isModalOpen, setIsModalOpen] = useState(true)
  const router = useRouter()
  const { user } = useAuth()
  const userId = user?.userId

  const handleClose = useCallback(() => {
    setIsModalOpen(false)
    router.push(`/profile/${userId || ''}`)
  }, [router, userId])

  return (
    <AuthGuard requireAuth>
      <CreatePostModal open={isModalOpen} onClose={handleClose} />
    </AuthGuard>
  )
}
