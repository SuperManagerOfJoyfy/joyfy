export type Notification = {
  id: number
  clientId: string
  message: string
  isRead: boolean
  createdAt: string
}

export type NotificationsResponse = {
  pageSize: number
  totalCount: number
  notReadCount: number
  items: Notification[]
}

export type MessageSendRequest = {
  message: string
  receiverId: number
}

export type MessageUpdateRequest = {
  id: number
  message: string
}

export type WebSocketError = {
  message: string
  error: string
}

export enum WS_EVENT_PATH {
  RECEIVE_MESSAGE = 'receive-message',
  UPDATE_MESSAGE = 'update-message',
  MESSAGE_DELETED = 'message-deleted',
  MESSAGE_SEND = 'message-send',
  NOTIFICATIONS = 'notifications',
  ERROR = 'error',
}

export enum MessageStatus {
  SENT = 'SENT',
  RECEIVED = 'RECEIVED',
  READ = 'READ',
}
