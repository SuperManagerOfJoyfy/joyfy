'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useCallback, useEffect } from 'react'
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
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (queryError) {
      const message =
        AUTH_MESSAGES.queryErrors[
          queryError as keyof typeof AUTH_MESSAGES.queryErrors
        ] || AUTH_MESSAGES.queryErrors.unknown
      setError(message)
      toast.error(message, { toastId: 'url-error' })
      return
    }

  }, [queryError])

  const [refreshToken, { isLoading: isRefreshLoading }] =
    useRefreshTokenMutation()

  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
    isSuccess,
  } = useGetMeQuery(undefined, {
    skip: !!queryError,
  })

  useEffect(() => {
    if (isSuccess && user) {
      toast.success(AUTH_MESSAGES.AUTH_SUCCESS, { toastId: 'success-toast' })
      router.push(PATH.ROOT)
    } else if (isUserError && !queryError) {
      const message = AUTH_MESSAGES.queryErrors.unauthorized
      setError(message)
      toast.error(message, { toastId: 'query-error' })
    }
  }, [isSuccess, isUserError, user, router, queryError])

  const retry = useCallback(async () => {
    setError(null)
    try {
      await refreshToken().unwrap()
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
