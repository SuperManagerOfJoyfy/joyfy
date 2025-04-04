'use client'

import { Button, Typography } from '@/shared/ui'
import { useOAuthLogin } from '../../hooks/useOAuthLogin'

import s from './oauthLoginSuccess.module.scss'

export const OauthLoginSuccess = () => {
  const { isLoading, error, retry } = useOAuthLogin()

  return (
    <div className={s.container}>
      {error ? (
        <div>
          <Typography className={s.error}>{error}</Typography>
          <Button onClick={retry}>Try again</Button>
        </div>
      ) : (
        <div>
          <Typography>
            {isLoading ? 'Completing login...' : 'Redirecting...'}
          </Typography>
          {isLoading && <div className={s.loader} />}
        </div>
      )}
    </div>
  )
}
