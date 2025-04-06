import { useLazyGetMeQuery } from '@/features/auth/api/authApi'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { toast } from 'react-toastify'

export const useOAuthLogin = () => {
  const router = useRouter()
  const [triggerGetMe] = useLazyGetMeQuery()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const completeAuth = useCallback(async () => {
    try {
      setError(null)
      setIsLoading(true)

      const user = await triggerGetMe().unwrap()

      if (user) {
        toast.success('Successfully signed in! Redirecting...')
        router.push('/')
      }
    } catch (err) {
      let message = 'Authentication failed. Please try again.'
      if (
        typeof err === 'object' &&
        err !== null &&
        'data' in err &&
        typeof err.data === 'object' &&
        err.data &&
        'message' in err.data
      ) {
        const backendMsg = (err.data as { message?: string }).message
        if (typeof backendMsg === 'string') {
          message = backendMsg
        }
      }

      setError(message)
      toast.error(message)
      console.error('OAuth login error:', err)
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
