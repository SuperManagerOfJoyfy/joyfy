import { useEffect } from 'react'
import { useAppDispatch } from '@/app/store/store'
import { getSocket } from '@/shared/config/socket'
import { notificationsApi } from '../api'
import { NotificationItemType } from '../api/notificationsApiTypes'
import { WS_EVENT_PATH } from '@/shared/constants'

export const useNotificationsSocket = () => {
  const dispatch = useAppDispatch()

  const handleWSNotification = (notification: NotificationItemType) => {
    dispatch(
      notificationsApi.util.updateQueryData('getNotifications', {}, (draft) => {
        const exists = draft.items.find((item) => item.id === notification.id)
        if (!exists) {
          draft.items.unshift(notification)
          draft.totalCount += 1
          if (!notification.isRead) draft.notReadCount += 1
        }
      })
    )
  }

  useEffect(() => {
    const socket = getSocket()

    socket?.on(WS_EVENT_PATH.NOTIFICATIONS, handleWSNotification)

    return () => {
      socket?.off(WS_EVENT_PATH.NOTIFICATIONS, handleWSNotification)
    }
  }, [dispatch])
}
