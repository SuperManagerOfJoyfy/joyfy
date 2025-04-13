import { useLogoutMutation } from '../api/authApi'
import { AUTH_MESSAGES } from '@/shared/config/messages'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

export const useLogout = () => {
  const [logout, { isLoading }] = useLogoutMutation()
  const router = useRouter()

  const logoutUser = useCallback(async () => {
    try {
      await logout().unwrap()
      router.push('/auth/login')
      return 'success'
    } catch (error: any) {
      const status = error?.status

      if (status === 401) return 'unauthorized'

      toast.error(AUTH_MESSAGES.LOGOUT_ERROR)
      console.error('[Logout error]:', error)
      return 'error'
    }
  }, [logout, router])

  return { logoutUser, isLoading }
}
