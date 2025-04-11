'use client'

import {
  useLazyGetMeQuery,
  useLogoutMutation,
  useRefreshTokenMutation,
} from '@/features/auth/api/authApi'
import { MeResponse } from '@/features/auth/api/authApi.types'
import React, {
  createContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from 'react'

import { toast } from 'react-toastify'
import { AUTH_MESSAGES } from '@/shared/config/messages'

type AuthContextType = {
  user: MeResponse | null
  isAuthenticated: boolean
  isLoading: boolean
  isError: boolean
  checkAuth: () => Promise<MeResponse | null>
  logoutUser: () => Promise<'success' | 'unauthorized' | 'error'>
  refetchUser: () => Promise<MeResponse | null>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [triggerGetMe, { isError }] = useLazyGetMeQuery()
  const [refreshToken] = useRefreshTokenMutation()
  const [logout] = useLogoutMutation()
  const [user, setUser] = useState<MeResponse | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [refreshAttempted, setRefreshAttempted] = useState<boolean>(false)

  const isAuthenticated = !!user

  const checkAuth = useCallback(
    async (showToast = false): Promise<MeResponse | null> => {
      setIsLoading(true)

      try {
        const userData = await triggerGetMe().unwrap()
        setUser(userData)

        if (showToast) {
          toast.success(AUTH_MESSAGES.AUTH_SUCCESS)
        }

        return userData
      } catch (error) {
        if (!refreshAttempted) {
          setRefreshAttempted(true)
          try {
            await refreshToken().unwrap()
            try {
              const userData = await triggerGetMe().unwrap()
              setUser(userData)

              if (showToast) {
                toast.success(AUTH_MESSAGES.SESSION_RESTORED)
              }

              return userData
            } catch {
              setUser(null)
              return null
            }
          } catch {
            setUser(null)
            return null
          }
        } else {
          setUser(null)
          return null
        }
      } finally {
        setIsLoading(false)
        setRefreshAttempted(false)
      }
    },
    [triggerGetMe, refreshToken, refreshAttempted]
  )

  const logoutUser = async (): Promise<
    'success' | 'unauthorized' | 'error'
  > => {
    try {
      await logout().unwrap()
      return 'success'
    } catch (error: any) {
      if (error?.status === 401) {
        return 'unauthorized'
      } else {
        console.error(AUTH_MESSAGES.LOGOUT_ERROR, error)
        return 'error'
      }
    } finally {
      setUser(null)
    }
  }

  const refetchUser = async (): Promise<MeResponse | null> => {
    return await checkAuth(false)
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const value = {
    user,
    isAuthenticated,
    isLoading,
    isError,
    checkAuth,
    logoutUser,
    refetchUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
