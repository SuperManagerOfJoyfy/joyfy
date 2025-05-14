'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { UserProfileProps } from '@/features/profile/ui/userProfile'
import { CreatePostModal } from './createPostModal'

type Props = {
  showCreateModal?: boolean
  onClose: (navigateBack?: boolean) => void
  user: Pick<UserProfileProps, 'userName' | 'avatars' | 'id'>
}

export const CreatePost = ({ showCreateModal, user }: Props) => {
  const [open, setOpen] = useState(showCreateModal || false)
  const router = useRouter()

  const handleClose = (shouldNavigateBack = true) => {
    setOpen(false)
    if (shouldNavigateBack) {
      router.back()
    }
  }

  useEffect(() => {
    setOpen(showCreateModal || false)
  }, [showCreateModal])

  if (!showCreateModal) return null

  return <CreatePostModal open={open} onClose={handleClose} user={user} />
}
