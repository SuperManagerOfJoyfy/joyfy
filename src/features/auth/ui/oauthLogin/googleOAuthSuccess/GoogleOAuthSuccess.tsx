'use client'

import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { PATH } from '@/shared/config/routes'
import { useGoogleLoginMutation, useLazyGetMeQuery } from '@/features/auth/api/authApi'
import { toast } from 'react-toastify'
import { Loader } from '@/shared/ui/loader/Loader'
import { useRouter } from '@/i18n/navigation'

export const GoogleOAuthSuccess = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [googleLogin] = useGoogleLoginMutation()
  const [getMe] = useLazyGetMeQuery()
  const [isLoading, setIsLoading] = useState(true)

  const hasProcessed = useRef(false)

  useEffect(() => {
    if (hasProcessed.current) {
      return
    }

    async function handleGoogleLogin() {
      try {
        hasProcessed.current = true

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
  }, [])

  if (isLoading) {
    return <Loader fullScreen message="Processing authentication..." />
  }

  return null
}
