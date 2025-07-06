import { io, Socket } from 'socket.io-client'
import { handleWSNotification } from './wsHandlers'

let socket: Socket | null = null

export enum WS_EVENT_PATH {
  RECEIVE_MESSAGE = 'receive-message',
  UPDATE_MESSAGE = 'update-message',
  MESSAGE_DELETED = 'message-deleted',
  MESSAGE_SEND = 'message-send',
  NOTIFICATIONS = 'notifications',
  ERROR = 'error',
}

export const initSocket = (token: string) => {
  socket = io(process.env.NEXT_PUBLIC_WS_URL, {
    transports: ['websocket'],
    query: {
      accessToken: token,
    },
  })

  socket.on('connect', () => {
    console.log('[socket] connected:', socket?.id)
  })

  socket.on(WS_EVENT_PATH.NOTIFICATIONS, handleWSNotification)

  socket.on(WS_EVENT_PATH.NOTIFICATIONS, (msg) => {
    console.log('[WS] Incoming message:', msg)
    handleWSNotification(msg)
  })

  socket.on(WS_EVENT_PATH.ERROR, (err) => {
    console.error('[socket] error:', err)
  })

  socket.on('disconnect', () => {
    console.log('Socket disconnected')
  })

  socket.onAny((event, ...args) => {
    console.log('[socket] event:', event, args)
  })
}

export const closeSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export const getSocket = () => socket
