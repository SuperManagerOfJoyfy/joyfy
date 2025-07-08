'use client'

import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { selectToken } from '@/features/auth/model/authSlice'

import { connectSocket } from '@/shared/config/socket'
import { WS_EVENT_PATH } from '@/shared/constants'
import { useNotificationsSocket } from '@/features/notifications/hooks'

export const SocketProvider = () => {
  const token = useSelector(selectToken)

  const tokenRef = useRef<string | null>(null)

  useNotificationsSocket()

  useEffect(() => {
    if (!token || token === tokenRef.current) return
    tokenRef.current = token

    const socket = connectSocket(token)

    socket.on('connect', () => {
      console.log('[socket] connected:', socket?.id)
    })

    socket.on(WS_EVENT_PATH.ERROR, (err) => {
      console.error('[socket] error:', err)
    })

    socket.on('disconnect', () => {
      console.log('Socket disconnected')
    })

    return () => {
      socket.off('connect')
      socket.off(WS_EVENT_PATH.ERROR)
      socket.off('disconnect')
      tokenRef.current = null
    }
  }, [token])

  return null
}
