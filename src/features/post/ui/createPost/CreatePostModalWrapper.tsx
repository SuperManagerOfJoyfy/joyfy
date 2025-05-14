'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'

import { useGetMeQuery } from '@/features/auth/api/authApi'
import { UserProfileProps } from '@/features/profile/ui/userProfile'
import { CreatePost } from './CreatePost'

export const CreatePostModalWrapper = () => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const action = searchParams.get('action')
  const postId = searchParams.get('postId')

  const { data: me } = useGetMeQuery()
  const [userData, setUserData] = useState<UserProfileProps | null>(null)

  useEffect(() => {
    if (postId && action === 'create') {
      const params = new URLSearchParams(searchParams.toString())
      params.delete('action')
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }
  }, [action, postId, pathname, router, searchParams])

  useEffect(() => {
    const fetchUserData = async () => {
      if (action === 'create' && me?.userId) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/public-user/profile/${me.userId}`)
        const json = await res.json()
        setUserData(json)
      }
    }

    fetchUserData()
  }, [action, me?.userId])

  if (action !== 'create' || !userData) return null

  const handleCloseModal = () => {
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.delete('action')
    router.replace(`${pathname}?${newParams.toString()}`, { scroll: false })
  }

  return <CreatePost showCreateModal={true} user={userData} onClose={handleCloseModal} />
}
