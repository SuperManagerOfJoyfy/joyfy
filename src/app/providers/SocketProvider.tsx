'use client'

import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated, selectToken } from '@/features/auth/model/authSlice'
import { useGetNotificationsQuery } from '@/features/notifications/api'
import { closeSocket, initSocket } from '@/shared/config/ws'

export const SocketProvider = () => {
  const token = useSelector(selectToken)
  const isAuthenticated = useSelector(selectIsAuthenticated)

  const tokenRef = useRef<string | null>(null)

  useGetNotificationsQuery(undefined, {
    skip: !isAuthenticated,
  })

  useEffect(() => {
    if (!token || token === tokenRef.current) return

    closeSocket()
    initSocket(token)
    tokenRef.current = token

    return () => {
      closeSocket()
      tokenRef.current = null
    }
  }, [token])

  return null
}
