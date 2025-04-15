'use client'

import { Login } from '@/features/auth/ui'
import { useLoginMutation } from '@/features/auth/api/authApi'
import { LoginFormValues } from '@/features/auth/ui/login'
import { useRouter } from 'next/navigation'
import { PATH } from '@/shared/config/routes'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { toast } from 'react-toastify'
import { useState } from 'react'
import { Loader } from '@/shared/ui/loader/Loader'

const Page = () => {
  const [login, { isLoading }] = useLoginMutation()
  const router = useRouter()
  const { refetchUser } = useAuth()
  const [isRedirecting, setIsRedirecting] = useState(false)

  async function handleLogin(data: LoginFormValues) {
    try {
      await login(data).unwrap()
      await refetchUser()
      setIsRedirecting(true)

      router.push(PATH.ROOT)
    } catch (error) {
      toast.error('Could not sign in')
      setIsRedirecting(false)
    }
  }

  if (isRedirecting) return <Loader />

  return (
    <div className="container">
      <Login isLoading={isLoading} onSubmit={handleLogin} />
    </div>
  )
}

export default Page
