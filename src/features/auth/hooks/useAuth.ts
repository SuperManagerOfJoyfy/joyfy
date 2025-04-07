import { useEffect, useState } from 'react'
import {
  useLazyGetMeQuery,
  useRefreshTokenMutation,
  useLogoutMutation,
} from '../api/authApi'
import { MeResponse } from '../api/authApi.types'

export const useAuth = () => {
  const [triggerGetMe, result] = useLazyGetMeQuery()
  const [refreshToken] = useRefreshTokenMutation()
  const [logout] = useLogoutMutation()
  const [user, setUser] = useState<MeResponse | null>(null)

  const isAuthenticated = !!user

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await triggerGetMe().unwrap()
        setUser(userData)
      } catch {
        try {
          await refreshToken().unwrap()
          const userData = await triggerGetMe().unwrap()
          setUser(userData)
        } catch {
          setUser(null)
        }
      }
    }

    fetchUserData()
  }, [triggerGetMe, refreshToken])

  const logoutUser = async () => {
    try {
      await logout().unwrap()
    } catch (err: any) {
      if (err?.status === 401) {
        console.warn('Already unauthorized')
      } else {
        throw err
      }
    } finally {
      setUser(null)
    }
  }

  return {
    user,
    isAuthenticated,
    isLoading: result.isLoading,
    isError: result.isError,
    isSuccess: result.isSuccess,
    refetch: triggerGetMe,
    logoutUser,
  }
}
