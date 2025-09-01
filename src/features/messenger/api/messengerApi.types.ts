import { AvatarType } from '@/features/profile/api'

export type BaseMessage = {
  pageSize: number
  totalCount: number
  notReadCount: number
  items: MessageItem[]
}

export type MessageItem = {
  id: number
  ownerId: number
  receiverId: number
  messageText: string
  createdAt: string
  updatedAt: string
  messageType: string
  status: MessageStatus
  userName: string
  avatars: AvatarType[]
}

export type ChatMessagesResponse = {
  pageSize: number
  totalCount: number
  notReadCount: number
  items: MessageItemByUser[]
}

export type ChatMessagesRequest = {
  dialoguePartnerId: string
  cursor?: number
  pageSize?: number
}

export type MessageItemByUser = Omit<MessageItem, 'userName' | 'avatars'>

export enum MessageStatus {
  SENT = 'SENT',
  RECEIVED = 'RECEIVED',
  READ = 'READ',
}
