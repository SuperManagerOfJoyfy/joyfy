'use client'

import { Login } from '@/features/auth/ui'
import { useLoginMutation } from '@/features/auth/api/authApi'
import { LoginFormValues } from '@/features/auth/ui/login'
import { useRouter } from 'next/navigation'
import { PATH } from '@/shared/config/routes'
import { useState } from 'react'
import { Loader } from '@/shared/ui/loader/Loader'
import { useAuth } from '@/features/auth/hooks/useAuth'

const Page = () => {
  const [login, { isLoading }] = useLoginMutation()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  const { user, isLoading: isUserLoading } = useAuth()

  async function handleLogin(data: LoginFormValues) {
    try {
      await login(data)
        .unwrap()
        .then((response) =>
          localStorage.setItem('accessToken', response.accessToken)
        )

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
