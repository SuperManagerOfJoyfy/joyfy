'use client'

import { useEffect } from 'react'
import { useAppDispatch } from '@/app/store/store'
import { setToken } from '../model/authSlice'
import LocalStorage from '@/shared/utils/localStorage/localStorage'

export const AuthInitializer = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const token = LocalStorage.getToken()
    if (token) {
      dispatch(setToken(token))
    }
  }, [])

  return null
}
