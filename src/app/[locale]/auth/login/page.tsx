'use client'

import { useEffect, useState } from 'react'
import { Login } from '@/features/auth/ui'
import { useGetMeQuery, useLoginMutation } from '@/features/auth/api/authApi'
import { LoginFormValues } from '@/features/auth/ui/login'
import { PATH } from '@/shared/config/routes'
import { useRouter } from '@/i18n/navigation'
import { Loader } from '@/shared/ui'

export default function Page() {
  const router = useRouter()
  const [login, { isLoading }] = useLoginMutation()
  const { data: user, isLoading: isUserLoading } = useGetMeQuery()

  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    if (!isUserLoading && user && !isRedirecting) {
      setIsRedirecting(true)
      router.replace(PATH.ROOT)
    }
  }, [user, isUserLoading, isRedirecting, router])

  async function handleLogin(data: LoginFormValues) {
    try {
      await login(data).unwrap()
      setIsRedirecting(true)
      router.replace(PATH.ROOT)
    } catch (error) {
      setIsRedirecting(false)
      throw error
    }
  }

  if (isRedirecting || isUserLoading) return <Loader />

  return (
    <div className="container">
      <Login isLoading={isLoading} onSubmit={handleLogin} />
    </div>
  )
}
