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
