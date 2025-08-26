import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

// Create and return the socket singleton
export const connectSocket = (token: string): Socket => {
  if (!socket) {
    socket = io('https://inctagram.work', {
      query: {
        accessToken: token,
      },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
    })
  }
  return socket
}

// Fully close and clean up the socket
export const closeSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

// Getter for use in hooks/components
export const getSocket = (): Socket | null => socket
