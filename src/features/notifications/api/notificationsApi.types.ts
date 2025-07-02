export type getNotificationsRequest = {
  cursor?: number
  sortBy?: string
  isRead?: boolean
  pageSize?: number
  sortDirection?: string
}

export type NotificationItemType = {
  id: number
  message: string
  isRead: boolean
  createdAt: string
}

export type NotificationsResponse = {
  pageSize: number
  totalCount: number
  notReadCount: number
  items: NotificationItemType[]
}

export type MarkAsReadRequestBody = {
  ids: number[]
}
