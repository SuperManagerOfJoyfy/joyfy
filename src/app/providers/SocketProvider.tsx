'use client'

import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectToken } from '@/features/auth/model/authSlice'

import { closeSocket, connectSocket } from '@/shared/config/socket'

export const SocketProvider = () => {
  const token = useSelector(selectToken)

  useEffect(() => {
    if (token) {
      connectSocket(token)
    } else {
      closeSocket()
    }
  }, [token])

  return null
}
