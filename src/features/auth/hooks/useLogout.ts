import { useDispatch } from 'react-redux'
import { authApi, useLogoutMutation } from '../api/authApi'
import { useCallback } from 'react'
import { AUTH_MESSAGES } from '@/shared/config/messages'
import { toast } from 'react-toastify'

export const useLogout = () => {
  const [logout, { isLoading }] = useLogoutMutation()
  const dispatch = useDispatch()

  const logoutUser = useCallback(async () => {
    try {
      await logout().unwrap()
      localStorage.removeItem('accessToken')
      dispatch(authApi.util.resetApiState())
      toast.success(AUTH_MESSAGES.LOGOUT_SUCCESS)
      return 'success'
    } catch (error: any) {
      toast.error(AUTH_MESSAGES.LOGOUT_ERROR)
      return 'error'
    }
  }, [logout, dispatch])

  return { logoutUser, isLoading }
}
