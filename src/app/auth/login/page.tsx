'use client'

import { Login } from '@/features/auth/ui'
import { useGetMeQuery, useLoginMutation } from '@/features/auth/api/authApi'
import { LoginFormValues } from '@/features/auth/ui/login'
import { useRouter } from 'next/navigation'
import { PATH } from '@/shared/config/routes'
import { useState } from 'react'
import { Loader } from '@/shared/ui/loader/Loader'
import { useGenerateColor } from '@/shared/ui/avatar/hooks/useGenerateColor'

const Page = () => {
  const { lightBackground, textColor } = useGenerateColor()
  const [login, { isLoading }] = useLoginMutation()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  const { data: user, isLoading: isUserLoading } = useGetMeQuery()

  async function handleLogin(data: LoginFormValues) {
    try {
      await login(data).unwrap()

      setIsRedirecting(true)

      localStorage.setItem('lightBackground', lightBackground)
      localStorage.setItem('textColor', textColor)

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
