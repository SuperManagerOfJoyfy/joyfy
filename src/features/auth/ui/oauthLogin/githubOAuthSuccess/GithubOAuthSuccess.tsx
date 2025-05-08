'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useLazyGetMeQuery } from '@/features/auth/api/authApi'
import { PATH } from '@/shared/config/routes'
import LocalStorage from '@/shared/utils/localStorage/localStorage'
import { Loader } from '@/shared/ui/loader/Loader'

export const GithubOAuthSuccess = () => {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const [triggerGetMe] = useLazyGetMeQuery()

  useEffect(() => {
    async function handleGithubLogin() {
      try {
        const token = searchParams.get('accessToken')
        const email = searchParams.get('email')
        const errorMsg = searchParams.get('error')

        if (errorMsg) {
          throw new Error(`GitHub authorization failed: ${errorMsg}`)
        }

        if (!token) {
          throw new Error('Missing access token in GitHub response')
        }

        LocalStorage.setToken(token)

        await new Promise((resolve) => setTimeout(resolve, 100))

        if (email) {
          localStorage.setItem('userEmail', email)
        }

        await triggerGetMe().unwrap()
        router.push(PATH.ROOT)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'GitHub authentication failed'
        router.push(PATH.AUTH.LOGIN)
      } finally {
        setIsLoading(false)
      }
    }

    handleGithubLogin()
  }, [searchParams, router, triggerGetMe])

  if (isLoading) {
    return <Loader fullScreen message="Processing authentication..." />
  }

  return null
}
