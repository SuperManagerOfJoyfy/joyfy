import { useLazyGetMeQuery } from '@/features/auth/api/authApi'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { toast } from 'react-toastify'

type ErrorWithData = {
  data?: {
    message?: string
  }
}

export const useOAuthLogin = () => {
  const router = useRouter()
  const [triggerGetMe] = useLazyGetMeQuery()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const extractErrorMessage = (err: unknown): string => {
    if (typeof err === 'object' && err !== null && 'data' in err) {
      const errorData = err as ErrorWithData
      return (
        errorData.data?.message || 'Authentication failed. Please try again.'
      )
    }

    return 'Authentication failed. Please try again.'
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
    completeAuth()
  }, [completeAuth])

  return {
    isLoading,
    error,
    retry: completeAuth,
  }
}
