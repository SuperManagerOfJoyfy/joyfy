'use client'

import { Button, Typography } from '@/shared/ui'
import { useOAuthLogin } from '../../hooks/useOAuthLogin'
import { ClipLoader } from 'react-spinners'
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
  <div className={s.loadingContainer} role="status" aria-busy="true">
    <ClipLoader color="#5e60ce" size={40} />
    <Typography className={s.loadingText}>{message}</Typography>
  </div>
)

export const OauthLoginSuccess = () => {
  const { isLoading, error, retry } = useOAuthLogin()

  if (error) return <ErrorView message={error} onRetry={retry} />

  return (
    <LoadingView
      message={isLoading ? 'Completing authentication...' : 'Redirecting...'}
    />
  )
}
