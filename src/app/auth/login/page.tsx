'use client'

import { Login } from '@/features/auth/ui'
import { useLoginMutation } from '@/features/auth/api/authApi'
import { LoginFormValues } from '@/features/auth/ui/login'
import { useRouter } from 'next/navigation'
import { PATH } from '@/shared/config/routes'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { toast } from 'react-toastify'

const Page = () => {
  const [login, { isLoading }] = useLoginMutation()
  const router = useRouter()
  const { refetchUser } = useAuth()

  async function handleLogin(data: LoginFormValues) {
    try {
      await login(data).unwrap()
      await refetchUser()

      router.push(PATH.ROOT)
    } catch (error) {
      toast.error('Could not sign in')
    }
  }

  return (
    <div className="container">
      <Login isLoading={isLoading} onSubmit={handleLogin} />
    </div>
  )
}

export default Page
