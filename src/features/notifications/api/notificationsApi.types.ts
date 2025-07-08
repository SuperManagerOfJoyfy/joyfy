export type NotificationsResponse = {
  pageSize: number
  totalCount: number
  notReadCount: number
  items: NotificationItemType[]
}

export type NotificationItemType = {
  id: number
  clientId: string
  message: string
  isRead: boolean
  createdAt: string
}

export type NotificationsRequest = {
  cursor?: number
  sortBy?: string
  isRead?: boolean
  pageSize?: number
  sortDirection?: 'asc' | 'desc'
}
