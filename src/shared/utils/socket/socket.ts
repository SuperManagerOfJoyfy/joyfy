import { io, Socket } from 'socket.io-client'

export const socket: Socket = io(process.env.NEXT_PUBLIC_WS_URL, {
  autoConnect: false,
})
