import { useEffect, useRef, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'
import { WS_EVENT_PATH } from '@/features/notifications/api/notificationsApi.types'

type UseNotificationWebSocketProps = {
  accessToken?: string
  onNotificationReceived?: (notification: any) => void
  onError?: (error: any) => void
}

export const useNotificationWebSocket = ({
  accessToken,
  onNotificationReceived,
  onError,
}: UseNotificationWebSocketProps) => {
  const socketRef = useRef<Socket | null>(null)
  const reconnectionTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const connect = useCallback(() => {
    if (!accessToken) return

    if (socketRef.current) {
      socketRef.current.disconnect()
    }

    const queryParams = {
      query: {
        accessToken,
      },
    }

    try {
      socketRef.current = io('https://inctagram.work', queryParams)

      socketRef.current.on('connect', () => {
        console.log('WebSocket connected')
      })

      socketRef.current.on('disconnect', (reason) => {
        console.log('WebSocket disconnected:', reason)

        if (reason !== 'io client disconnect' && accessToken) {
          reconnectionTimeoutRef.current = setTimeout(() => {
            connect()
          }, 3000)
        }
      })
      socketRef.current.on(WS_EVENT_PATH.NOTIFICATIONS, (notification) => {
        console.log('Received notification:', notification)
        onNotificationReceived?.(notification)
      })

      socketRef.current.on(WS_EVENT_PATH.ERROR, (error) => {
        console.error('WebSocket error:', error)
        onError?.(error)
      })

      socketRef.current.on('connect_error', (error) => {
        console.error('Connection error:', error)
        onError?.(error)
      })
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error)
      onError?.(error)
    }
  }, [accessToken, onNotificationReceived, onError])

  const disconnect = useCallback(() => {
    if (reconnectionTimeoutRef.current) {
      clearTimeout(reconnectionTimeoutRef.current)
      reconnectionTimeoutRef.current = null
    }

    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
    }
  }, [])

  useEffect(() => {
    if (accessToken) {
      connect()
    } else {
      disconnect()
    }

    return () => {
      disconnect()
    }
  }, [accessToken, connect, disconnect])

  return {
    socket: socketRef.current,
    connect,
    disconnect,
    isConnected: socketRef.current?.connected ?? false,
  }
}
