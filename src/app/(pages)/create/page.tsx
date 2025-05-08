'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

import { CreatePostModal } from '@/features/post/ui/createPost/createPostModal'
import { AuthGuard } from '@/features/auth/ui'
import { useGetMeQuery } from '@/features/auth/api/authApi'

export default function CreatePostPage() {
  const [isModalOpen, setIsModalOpen] = useState(true)
  const router = useRouter()
  const { data: user } = useGetMeQuery()
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
