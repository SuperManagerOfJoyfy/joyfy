'use client'

import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { useGetUserProfileQuery } from '@/features/profile/api/profileApi'
import { CreatePost } from './CreatePost'
import { useEffect } from 'react'

export const CreatePostModalWrapper = () => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const action = searchParams.get('action')
  const postId = searchParams.get('postId')

  const { data: userData } = useGetUserProfileQuery()

  useEffect(() => {
    if (postId && action === 'create') {
      const params = new URLSearchParams(searchParams.toString())
      params.delete('action')
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }
  }, [action, postId, pathname, router, searchParams])

  if (action !== 'create' || !userData) return null

  const handleCloseModal = () => {
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.delete('action')
    router.replace(`${pathname}?${newParams.toString()}`, { scroll: false })
  }

  return <CreatePost showCreateModal={true} user={userData} onClose={handleCloseModal} />
}
