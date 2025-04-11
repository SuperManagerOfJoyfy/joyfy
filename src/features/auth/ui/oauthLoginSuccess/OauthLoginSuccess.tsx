'use client'

import { useOAuthLogin } from '../../hooks/useOAuthLogin'
import { useAuth } from '../../hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { Button, Typography } from '@/shared/ui'
import { Loader } from '@/shared/ui/loader/Loader'
import { PATH } from '@/shared/config/routes'
import s from './oauthLoginSuccess.module.scss'

type ErrorViewProps = {
  message: string
  onRetry: () => void
}

const ErrorView = ({ message, onRetry }: ErrorViewProps) => (
  <div className={s.errorContainer} role="alert">
    <Typography className={s.errorText}>{message}</Typography>
    <Button onClick={onRetry}>Try again</Button>
  </div>
)

const LoadingView = ({ message }: { message: string }) => (
  <Loader message={message} />
)

export const OauthLoginSuccess = () => {
  const { isLoading, error, retry } = useOAuthLogin()
  const { isAuthenticated } = useAuth()
  const [isRedirecting, setIsRedirecting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated && !isRedirecting) {
      setIsRedirecting(true)
      router.push(PATH.ROOT)
    }
  }, [isAuthenticated, isRedirecting, router])

  const message = useMemo(() => {
    if (isRedirecting) return 'Redirecting...'
    if (isLoading) return 'Completing authentication...'
    return 'Please wait...'
  }, [isRedirecting, isLoading])

  if (error) {
    return <ErrorView message={error} onRetry={retry} />
  }

  return <LoadingView message={message} />
}
