'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { UserProfileProps } from '@/features/profile/ui/userProfile'
import { CreatePostModal } from './createPostModal'

type Props = {
  showCreateModal?: boolean
  user: Pick<UserProfileProps, 'userName' | 'avatars' | 'id'>
}

export const CreatePost = ({ showCreateModal, user }: Props) => {
  const [open, setOpen] = useState(showCreateModal || false)
  const router = useRouter()

  const handleClose = () => {
    setOpen(false)
    router.push(`/profile/${user?.id}`)
  }

  useEffect(() => {
    setOpen(showCreateModal || false)
  }, [showCreateModal])

  if (!showCreateModal) return null

  return <CreatePostModal open={open} onClose={handleClose} user={user} />
}
