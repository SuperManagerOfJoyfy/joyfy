'use client'

import { Login } from '@/features/auth/ui'
import { useLoginMutation } from '@/features/auth/api/authApi'
import { LoginFormValues } from '@/features/auth/ui/login'
import { useRouter } from 'next/navigation'

const Page = () => {
  const [login] = useLoginMutation()
  const router = useRouter()

  async function handleLogin(data: LoginFormValues) {
    try {
      await login(data)
      router.push('/')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="container">
      <Login onSubmit={handleLogin} />
    </div>
  )
}

export default Page
