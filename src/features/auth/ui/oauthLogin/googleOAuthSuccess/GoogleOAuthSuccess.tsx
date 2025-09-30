'use client'

import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { useGoogleLoginMutation, useLazyGetMeQuery } from '@/features/auth/api/authApi'
import { toast } from 'react-toastify'
import { Loader } from '@/shared/ui/loader/Loader'

export const GoogleOAuthSuccess = () => {
  const searchParams = useSearchParams()
  const [googleLogin] = useGoogleLoginMutation()
  const [getMe] = useLazyGetMeQuery()
  const [isLoading, setIsLoading] = useState(true)

  const hasProcessed = useRef(false)

  useEffect(() => {
    if (hasProcessed.current) return

    async function handleGoogleLogin() {
      try {
        hasProcessed.current = true

        const code = searchParams.get('code')
        const errorMsg = searchParams.get('error')

        if (errorMsg) {
          throw new Error(`Authorization failed: ${errorMsg}`)
        }

        if (!code) {
          throw new Error('Missing code parameter')
        }

        const redirectUrl = `${window.location.origin}/auth/google`

        const response = await googleLogin({
          code,
          redirectUrl,
        }).unwrap()

        if (response?.accessToken) {
          await getMe().unwrap()

          const locale = localStorage.getItem('locale') || 'en'
          window.location.href = `/${locale}`
        } else {
          throw new Error('Invalid response from server')
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Authentication failed'
        toast.error(errorMessage)

        const locale = localStorage.getItem('locale') || 'en'
        window.location.href = `/${locale}/auth/login`
      } finally {
        setIsLoading(false)
      }
    }

    handleGoogleLogin()
  }, [searchParams, googleLogin, getMe])

  if (isLoading) {
    return <Loader fullScreen message="Processing authentication..." />
  }

  return null
}
