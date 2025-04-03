'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  useGetMeQuery,
  //   useProcessOAuthTokenMutation,
} from '@/features/auth/api/authApi'
// import { saveAccessToken } from '@/features/auth/utils/tokenStorage/TokenStorage'

export const useOAuthLogin = () => {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [tokenProcessed, setTokenProcessed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [processToken] = useProcessOAuthTokenMutation()

  const {
    data: user,
    isSuccess,
    isError,
  } = useGetMeQuery(undefined, {
    skip: !tokenProcessed,
  })

  useEffect(() => {
    const handleOAuthLogin = async () => {
      try {
        console.log(
          '🔄 Fetching access token from /auth/github/login-success...'
        )

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/github/login-success`,
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )

        const data = await res.json()

        if (!data.accessToken) {
          throw new Error('accessToken not found in response')
        }

        console.log('✅ accessToken received:', data.accessToken)

        saveAccessToken(data.accessToken)
        await processToken({ token: data.accessToken }).unwrap()
        setTokenProcessed(true)
      } catch (err) {
        console.error('❌ OAuth handling error:', err)
        setError('Authentication error. Please try again.')
        setIsLoading(false)
      }
    }

    handleOAuthLogin()
  }, [processToken])

  useEffect(() => {
    if (tokenProcessed) {
      if (isSuccess && user) {
        console.log('✅ Authentication successful, redirecting...')
        localStorage.removeItem('auth_pending')
        localStorage.removeItem('auth_timestamp')
        router.push('/')
      } else if (isError) {
        setError('Failed to fetch user data.')
        setIsLoading(false)
      }
    }
  }, [tokenProcessed, user, isSuccess, isError, router])

  return {
    isLoading,
    error,
    retry: () => location.reload(),
  }
}
