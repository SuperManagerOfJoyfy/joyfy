'use client'

import { useOAuthLogin } from '../../hooks/useOAuthLogin'
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

export const OauthLoginSuccess = () => {
  const { isLoading, error, retry } = useOAuthLogin()

  if (error) {
    return <ErrorView message={error} onRetry={retry} />
  }

  return (
    <Loader
      message={isLoading ? 'Completing authentication...' : 'Redirecting...'}
    />
  )
}
