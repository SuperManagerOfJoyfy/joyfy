'use client'

import { useAppDispatch } from '@/app/store/store'
import { closeSocket } from '@/shared/config/socket'
import LocalStorage from '@/shared/utils/localStorage/localStorage'
import { useEffect } from 'react'
import { authApi } from '../api/authApi'
import { clearToken, setCurrentUser, setToken } from '../model/authSlice'

export const AuthInitializer = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const initAuth = async () => {
      const token = LocalStorage.getToken()

      if (token) {
        dispatch(setToken(token))

        try {
          // Fetch current user
          const meResult = await dispatch(authApi.endpoints.getMe.initiate())
          if ('data' in meResult && meResult.data) {
            dispatch(setCurrentUser(meResult.data))
          }
        } catch (error) {
          console.error('Failed to fetch user:', error)
          // Token might be invalid, clear it
          LocalStorage.removeToken()
          dispatch(clearToken())
          closeSocket()
        }
      }
    }

    initAuth()
  }, [dispatch])

  return null
}
