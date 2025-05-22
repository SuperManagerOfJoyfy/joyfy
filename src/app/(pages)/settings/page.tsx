'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

import { PATH } from '@/shared/config/routes'
import { Loader } from '@/shared/ui/loader/Loader'
import { useGetMeQuery } from '@/features/auth/api/authApi'
import { ProfileSettings } from '@/features/profile/ui'

const SettingsPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const part = searchParams.get('part') || 'info'
  const { data: user, isLoading } = useGetMeQuery()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(PATH.AUTH.LOGIN)
    }
  }, [isLoading, user, router])

  if (isLoading) {
    return <Loader />
  }

  if (!user) {
    return null
  }

  return <ProfileSettings activePart={part} userId={user.userId} />
}

export default SettingsPage
