import { useDispatch } from "react-redux"
import { authApi, useLogoutMutation } from "../api/authApi"
import { useCallback } from "react"
import { AUTH_MESSAGES } from "@/shared/config/messages"
import { toast } from "react-toastify"

export const useLogout = () => {
  const [logout, { isLoading }] = useLogoutMutation()
  const dispatch = useDispatch()

  const logoutUser = useCallback(async () => {
    try {
      await logout().unwrap()
      dispatch(authApi.util.resetApiState())
      return 'success'
    } catch (error: any) {
      const status = error?.status
      if (status === 401) return 'unauthorized'

      toast.error(AUTH_MESSAGES.LOGOUT_ERROR)
      console.error('[Logout error]:', error)
      return 'error'
    }
  }, [logout, dispatch])

  return { logoutUser, isLoading }
}
