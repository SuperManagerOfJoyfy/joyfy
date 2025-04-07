import { useLazyGetMeQuery } from '@/features/auth/api/authApi'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { toast } from 'react-toastify'

type ErrorWithData = {
  data?: {
    message?: string
  }
  status?: number
}

const queryErrorMessages: Record<string, string> = {
  email_exists:
    'This email is already registered with a different method. Please use your original login method.',
  account_not_found: 'Account not found. Please register first.',
  unauthorized: 'Authentication failed. Please try again.',
  unknown: 'Authentication error. Please try again later.',
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

      if (errorData.data?.message?.includes('email already exists')) {
        return queryErrorMessages.email_exists
      }

      if (errorData.data?.message?.includes('account not found')) {
        return queryErrorMessages.account_not_found
      }

      if (errorData.status === 401) {
        return queryErrorMessages.unauthorized
      }

      return errorData.data?.message || queryErrorMessages.unknown
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

    return queryErrorMessages.unknown
  }

  const completeAuth = useCallback(async () => {
    setError(null)
    setIsLoading(true)

    try {
      const user = await triggerGetMe().unwrap()

      if (user) {
        toast.success('Successfully signed in! Redirecting...')
        router.push('/')
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
        queryErrorMessages[queryError] || queryErrorMessages.unknown
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
