'use client'

import { useOAuthLogin } from '../../hooks/useOAuthLogin'
import { useAuth } from '../../hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button, Typography } from '@/shared/ui'
import { Loader } from '@/shared/ui/loader/Loader'
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

type LoadingViewProps = {
  message: string
}

const LoadingView = ({ message }: LoadingViewProps) => (
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
    }
  }, [isAuthenticated, isRedirecting])

  useEffect(() => {
    if (isRedirecting) {
      router.push('/')
    }
  }, [isRedirecting, router])

  if (error) {
    return <ErrorView message={error} onRetry={retry} />
  }

  const message = isRedirecting
    ? 'Redirecting...'
    : isLoading
      ? 'Completing authentication...'
      : 'Please wait...'

  return <LoadingView message={message} />
}
