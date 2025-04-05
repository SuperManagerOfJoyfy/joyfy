'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { useGetMeQuery } from '@/features/auth/api/authApi'
import { toast } from 'react-toastify'

export const useOAuthLogin = () => {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { refetch } = useGetMeQuery(undefined, { skip: true })

  useEffect(() => {
    const completeAuth = async () => {
      try {
        const user = await refetch().unwrap()

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
    }

    completeAuth()
  }, [refetch, router])

  return {
    isLoading,
    error,
    retry: () => {
      setError(null)
      setIsLoading(true)
      refetch()
    },
  }
}
