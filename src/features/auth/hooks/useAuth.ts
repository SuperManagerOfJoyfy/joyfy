import { useGetMeQuery } from '@/features/auth/api/authApi'
import LocalStorage from '@/shared/utils/localStorage/localStorage'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

export const useAuth = () => {
  const token = LocalStorage.getToken()
  const [isAppInitialized, setIsAppInitialized] = useState(false)

  const {
    data: user,
    isLoading,
    isError,
    isSuccess,
  } = useGetMeQuery(undefined, {
    skip: !token,
  })

  useEffect(() => {
    if (!isLoading) {
      setIsAppInitialized(true)
    }
  }, [isLoading])

  return {
		user,
		isLoading,
		isError,
		isSuccess,
		isAppInitialized,
		isAuthenticated: !!user
	}
}
