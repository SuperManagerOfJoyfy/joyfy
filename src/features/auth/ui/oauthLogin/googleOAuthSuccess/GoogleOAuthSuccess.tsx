'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PATH } from '@/shared/config/routes'
import { useGoogleLoginMutation, useLazyGetMeQuery } from '@/features/auth/api/authApi'
import { toast } from 'react-toastify'
import LocalStorage from '@/shared/utils/localStorage/localStorage'
import { Loader } from '@/shared/ui/loader/Loader'

export const GoogleOAuthSuccess = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [googleLogin] = useGoogleLoginMutation()
  const [getMe] = useLazyGetMeQuery()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function handleGoogleLogin() {
      try {
        const code = searchParams.get('code')
        const errorMsg = searchParams.get('error')

        if (errorMsg) {
          throw new Error(`Authorization failed: ${errorMsg}`)
        }

        if (!code) {
          throw new Error('Missing code parameter in Google authentication response')
        }

        const redirectUrl = `${window.location.origin}/auth/google`
        const response = await googleLogin({
          code,
          redirectUrl,
        }).unwrap()

        if (response?.accessToken) {
          LocalStorage.setToken(response.accessToken)

          await new Promise((resolve) => setTimeout(resolve, 100))

          await getMe().unwrap()
          router.push(PATH.ROOT)
        } else {
          throw new Error('Invalid response from server')
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Authentication processing failed'
        toast.error(errorMessage)
        router.push(PATH.AUTH.LOGIN)
      } finally {
        setIsLoading(false)
      }
    }

    handleGoogleLogin()
  }, [searchParams, router, googleLogin, getMe])

  if (isLoading) {
    return <Loader fullScreen message="Processing authentication..." />
  }

  return null
}
