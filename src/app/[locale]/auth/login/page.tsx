'use client'

import { Login } from '@/features/auth/ui'
import { useGetMeQuery, useLoginMutation } from '@/features/auth/api/authApi'
import { LoginFormValues } from '@/features/auth/ui/login'
import { PATH } from '@/shared/config/routes'
import { useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { Loader } from '@/shared/ui'

const Page = () => {
  const [login, { isLoading }] = useLoginMutation()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  const { data: user, isLoading: isUserLoading } = useGetMeQuery()

  async function handleLogin(data: LoginFormValues) {
    try {
      await login(data).unwrap()

      setIsRedirecting(true)

      router.push(PATH.ROOT)
    } catch (error) {
      setIsRedirecting(false)
      throw error
    }
  }

  if (isRedirecting || isUserLoading) return <Loader />

  if (user) {
    router.push(PATH.ROOT)
    return <Loader />
  }

  return (
    <div className="container">
      <Login isLoading={isLoading} onSubmit={handleLogin} />
    </div>
  )
}

export default Page
