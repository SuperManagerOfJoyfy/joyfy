'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGetMeQuery } from '@/features/auth/api/authApi'

const OAuthCallback = () => {
  const { data: user, isSuccess, isError, error } = useGetMeQuery()
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (isSuccess) {
      router.push('/')
    } else if (isError) {
      console.error('Authentication error:', error)
      setErrorMessage('Error while logging in. Please try again.')

      const timer = setTimeout(() => {
        router.push('/login')
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [isSuccess, isError, router, error])

  return (
    <div>
      {!isError ? (
        <p>Logging in...</p>
      ) : (
        <p className="error">{errorMessage}</p>
      )}
    </div>
  )
}

export default OAuthCallback
