import { AvatarType } from '@/features/profile/api'

export type ChatResponse = {
  pageSize: number
  totalCount: number
  notReadCount: number
  items: ChatItem[]
}

export type ChatItem = {
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

export type MessageResponse = {
  pageSize: number
  totalCount: number
  notReadCount: number
  items: MessageItem[]
}

export type MessageRequest = {
  dialoguePartnerId: string
  cursor?: number
  pageSize?: number
}

export type MessageItem = Omit<ChatItem, 'userName' | 'avatars'>

export enum MessageStatus {
  SENT = 'SENT',
  RECEIVED = 'RECEIVED',
  READ = 'READ',
}
