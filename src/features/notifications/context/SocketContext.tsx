'use client'

import LocalStorage from '@/shared/utils/localStorage/localStorage'
import { socket } from '@/shared/utils/socket/socket'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'

type SocketContextType = {
  socket: Socket
  notification: Notification | null
}

type Notification = {
  id: number
  clientId: string
  message: string
  isRead: boolean
  notifyAt: string
  createdAt: string
  eventType: number
}

export const SocketContext = createContext<SocketContextType | undefined>(undefined)

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) throw new Error('useSocket must be used within SocketProvider')
  return context
}

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [notification, setNotification] = useState<Notification | null>(null)

  useEffect(() => {
    const token = LocalStorage.getToken()
    const handleNotification = (notificationMessage: Notification) => {
      console.log('Notification:', notificationMessage)
      setNotification(notificationMessage)
    }

    if (!token) return

    socket.io.opts.query = { accessToken: token }
    socket.connect()

    socket.on('connect', () => {
      socket.on('notifications', handleNotification)
    })

    return () => {
      socket.off('notifications', handleNotification)
      socket.off('connect')
    }
  }, [])

  return <SocketContext.Provider value={{ socket, notification }}>{children}</SocketContext.Provider>
}
