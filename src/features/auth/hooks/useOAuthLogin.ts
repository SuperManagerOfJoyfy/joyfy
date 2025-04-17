'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { toast } from 'react-toastify'
import {
  useGetMeQuery,
  useRefreshTokenMutation,
} from '@/features/auth/api/authApi'
import { PATH } from '@/shared/config/routes'
import { AUTH_MESSAGES } from '@/shared/config/messages'

export const useOAuthLogin = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryError = searchParams.get('error')

  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
    isSuccess: isUserSuccess,
  } = useGetMeQuery(undefined, { skip: false })
  const [refreshToken, { isLoading: isRefreshLoading }] =
    useRefreshTokenMutation()

  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (queryError) {
      const message =
        AUTH_MESSAGES.queryErrors[
          queryError as keyof typeof AUTH_MESSAGES.queryErrors
        ] || AUTH_MESSAGES.queryErrors.unknown
      setError(message)
      toast.error(message)
    }
  }, [queryError])

  useEffect(() => {
    if (!queryError && isUserError) {
      const message = AUTH_MESSAGES.queryErrors.unauthorized
      setError(message)
      toast.error(message)
    }
  }, [isUserError, queryError])

  useEffect(() => {
    if (isUserSuccess && user) {
      toast.success(AUTH_MESSAGES.AUTH_SUCCESS)
      router.push(PATH.ROOT)
    }
  }, [isUserSuccess, user, router])

  const retry = useCallback(async () => {
    setError(null)
    try {
      const refreshResponse = await refreshToken().unwrap()
      if (refreshResponse.accessToken) {
        const { data } = await useGetMeQuery(undefined, { skip: false })
        if (data) {
          toast.success(AUTH_MESSAGES.AUTH_SUCCESS)
        }
      }
    } catch {
      toast.error(AUTH_MESSAGES.queryErrors.unknown)
    }
  }, [refreshToken])

  return {
    isLoading: isUserLoading || isRefreshLoading,
    error,
    retry,
  }
}
