import { useState, useEffect, useCallback } from 'react'
import {
  useGetMeQuery,
  useLazyGetMeQuery,
  useRefreshTokenMutation,
} from '../api/authApi'
import { toast } from 'react-toastify'
import { AUTH_MESSAGES } from '@/shared/config/messages'

export const useAuth = () => {
  const {
    data: user,
    isLoading: isMeLoading,
    isError: isMeError,
  } = useGetMeQuery(undefined, {
    skip: false,
    refetchOnMountOrArgChange: false,
  })

  const [triggerGetMe, { isLoading: isLazyMeLoading }] = useLazyGetMeQuery()
  const [refreshToken, { isLoading: isRefreshLoading }] =
    useRefreshTokenMutation()

  const [isInitialized, setIsInitialized] = useState(false)

  const isAuthenticated = !!user
  const isLoading =
    isMeLoading || isLazyMeLoading || isRefreshLoading || !isInitialized

  const tryRefreshAndGetMe = useCallback(
    async (showToast = false) => {
      try {
        await refreshToken().unwrap()
        const userData = await triggerGetMe().unwrap()

        if (showToast) {
          toast.success(AUTH_MESSAGES.SESSION_RESTORED)
        }

        return userData
      } catch {
        return null
      }
    },
    [refreshToken, triggerGetMe]
  )

  const checkAuth = useCallback(
    async (showToast = false) => {
      try {
        const userData = await triggerGetMe().unwrap()
        if (showToast) {
          toast.success(AUTH_MESSAGES.AUTH_SUCCESS)
        }
        return userData
      } catch {
        return await tryRefreshAndGetMe(showToast)
      }
    },
    [triggerGetMe, tryRefreshAndGetMe]
  )

  useEffect(() => {
    const init = async () => {
      if (isMeError) {
        await tryRefreshAndGetMe(false)
      }
      setIsInitialized(true)
    }

    if (!isInitialized) {
      init()
    }
  }, [isMeError, isInitialized, tryRefreshAndGetMe])

  const refetchUser = useCallback(() => checkAuth(false), [checkAuth])

  return {
    user,
    isAuthenticated,
    isLoading,
    isError: isMeError,
    checkAuth,
    refetchUser,
  }
}
