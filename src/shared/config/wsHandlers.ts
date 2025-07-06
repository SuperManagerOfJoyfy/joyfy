import { store } from '@/app/store/store'
import { notificationsApi } from '@/features/notifications/api/notificationsApi'

type Notification = {
  id: number
  clientId: string
  message: string
  isRead: boolean
  notifyAt: string
  createdAt: string
  eventType: number
}

const handleWSNotification = (message: Notification) => {
  console.log('Full WS message:', message)

  const newItem = message
  console.log('Extracted payload:', newItem)

  if (!newItem || !newItem.id) {
    console.warn('Invalid notification payload:', newItem)
    return
  }

  store.dispatch(
    notificationsApi.util.updateQueryData('getNotifications', undefined, (draft) => {
      const exists = draft.items.some((item) => item.id === newItem.id)
      if (!exists) {
        draft.items.unshift(newItem)
        draft.notReadCount += 1
      }
    })
  )
}

export { handleWSNotification }
