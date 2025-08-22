'use client'

import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { selectToken } from '@/features/auth/model/authSlice'

import { closeSocket, connectSocket } from '@/shared/config/socket'

export const SocketProvider = () => {
  const token = useSelector(selectToken)
  const tokenRef = useRef<string | null>(null)

  useEffect(() => {
    if (!token || token === tokenRef.current) return
    tokenRef.current = token

    const socket = connectSocket(token)

    socket.on('connect', () => {
      console.log('[socket] connected:', socket.id)
    })
    socket.on('connect_error', (err) => {
      console.error('[socket] connect_error:', err)
    })

    socket.on('disconnect', (reason) => {
      console.log('[socket] disconnected:', reason)
    })

    return () => closeSocket()
  }, [token])

  return null
}
