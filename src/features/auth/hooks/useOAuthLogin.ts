'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { toast } from 'react-toastify'

import { useAuth } from '@/features/auth/hooks/useAuth'
import { PATH } from '@/shared/config/routes'
import { AUTH_MESSAGES } from '@/shared/config/messages'

export const useOAuthLogin = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryError = searchParams.get('error')

  const { isAuthenticated, isLoading, isError, refetchUser } = useAuth()
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
    if (!queryError && isError) {
      const message = AUTH_MESSAGES.queryErrors.unauthorized
      setError(message)
      toast.error(message)
    }
  }, [isError, queryError])

  useEffect(() => {
    if (isAuthenticated) {
      toast.success(AUTH_MESSAGES.AUTH_SUCCESS)
      router.push(PATH.ROOT)
    }
  }, [isAuthenticated, router])

  const retry = useCallback(async () => {
    setError(null)
    try {
      const user = await refetchUser()
      if (user) {
        toast.success(AUTH_MESSAGES.AUTH_SUCCESS)
      }
    } catch {
      toast.error(AUTH_MESSAGES.queryErrors.unknown)
    }
  }, [refetchUser])

  return {
    isLoading,
    error,
    retry,
  }
}
