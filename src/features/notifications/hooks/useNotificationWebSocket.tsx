import { useEffect } from 'react'
import { io, Socket } from 'socket.io-client'
import { useDispatch } from 'react-redux'

import { WS_EVENT_PATH } from '@/features/notifications/api/notificationsApi.types'
import LocalStorage from '@/shared/utils/localStorage/localStorage'
import { Notification } from '@/features/notifications/api/notificationsApi.types'
import { addRealtimeNotification } from '../store/notificationsSlice'

let globalSocket: Socket | null = null

export const useNotificationWebSocket = () => {
  const dispatch = useDispatch()

  const disconnect = () => {
    if (globalSocket) {
      console.log('[WebSocket] disconnect()')
      globalSocket.disconnect()
      globalSocket = null
    }
  }

  const connect = (accessToken: string) => {
    if (globalSocket) {
      console.log('[WebSocket] socket already exists, skipping connect')
      return
    }

    console.log('[WebSocket] connect() with token:', accessToken)

    const socket = io('https://inctagram.work', {
      query: { accessToken },
      transports: ['websocket'],
    })

    globalSocket = socket

    socket.on('connect', () => {
      console.log('[WebSocket] connected')
    })

    socket.on('disconnect', (reason) => {
      console.log('[WebSocket] disconnected:', reason)
      globalSocket = null
    })

    socket.on('connect_error', (error) => {
      console.error('[WebSocket] connect_error:', error)
      globalSocket = null
    })

    socket.on(WS_EVENT_PATH.NOTIFICATIONS, (notification: Partial<Notification>) => {
      console.log('🔔 New notification received:', notification)

      const completeNotification: Notification = {
        id: notification.id!,
        message: notification.message!,
        isRead: notification.isRead!,
        createdAt: notification.createdAt || new Date().toISOString(),
        clientId: notification.clientId!,
      }

      dispatch(addRealtimeNotification(completeNotification))
    })
  }

  useEffect(() => {
    const token = LocalStorage.getToken()
    if (!token) return

    connect(token)

    return () => {
      disconnect()
    }
  }, [])
}
