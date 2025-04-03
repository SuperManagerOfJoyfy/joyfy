'use client'

import { useOAuthLogin } from '../../hooks/useOAuthLogin'

export default function OauthLoginSuccess() {
  const { isLoading, error, retry } = useOAuthLogin()

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      {error ? (
        <>
          <p style={{ color: 'red' }}>{error}</p>
          <button onClick={retry}>Try Again</button>
        </>
      ) : (
        <p>{isLoading ? 'Completing authentication...' : 'Redirecting...'}</p>
      )}
    </div>
  )
}
