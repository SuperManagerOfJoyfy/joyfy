'use client'

import { useLazyGetMeQuery } from '@/features/auth/api/authApi'
import { PATH } from '@/shared/config/routes'
import { AUTH_MESSAGES } from '@/shared/config/messages'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { toast } from 'react-toastify'

type ErrorWithData = {
  data?: {
    message?: string
  }
  status?: number
}

export const useOAuthLogin = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryError = searchParams.get('error')
  const [triggerGetMe] = useLazyGetMeQuery()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const extractErrorMessage = (err: unknown): string => {
    console.error('Raw OAuth error:', err)

    if (typeof err === 'object' && err !== null && 'data' in err) {
      const errorData = err as ErrorWithData
      const msg = errorData.data?.message?.toLowerCase() || ''

      if (msg.includes('email already exists')) {
        return AUTH_MESSAGES.queryErrors.email_exists
      }

      if (msg.includes('account not found')) {
        return AUTH_MESSAGES.queryErrors.account_not_found
      }

      if (errorData.status === 401) {
        return AUTH_MESSAGES.queryErrors.unauthorized
      }

      return errorData.data?.message || AUTH_MESSAGES.queryErrors.unknown
    }

    if (err instanceof Error) {
      if (
        err.message.includes('Network') ||
        err.message.includes('ECONNREFUSED')
      ) {
        return 'Connection error. Please check your internet connection and try again.'
      }
      return err.message
    }

    return AUTH_MESSAGES.queryErrors.unknown
  }

  const completeAuth = useCallback(async () => {
    setError(null)
    setIsLoading(true)

    try {
      const user = await triggerGetMe().unwrap()

      if (user) {
        toast.success(AUTH_MESSAGES.AUTH_SUCCESS)
        router.push(PATH.ROOT)
      }
    } catch (err) {
      const message = extractErrorMessage(err)
      toast.error(message)
      console.error('OAuth login error:', err)
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [triggerGetMe, router])

  useEffect(() => {
    if (queryError) {
      const message =
        AUTH_MESSAGES.queryErrors[
          queryError as keyof typeof AUTH_MESSAGES.queryErrors
        ] || AUTH_MESSAGES.queryErrors.unknown
      setError(message)
      setIsLoading(false)
      toast.error(message)
      return
    }

    completeAuth()
  }, [queryError, completeAuth])

  return {
    isLoading,
    error,
    retry: completeAuth,
  }
}
