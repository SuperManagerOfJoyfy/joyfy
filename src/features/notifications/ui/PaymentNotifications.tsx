import { store, useAppDispatch } from '@/app/store/store'
import {
  notificationsApi,
  useGetNotificationsQuery,
  useLazyGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
} from '@/features/notifications/api/notificationsApi.'
import { useSocket } from '@/features/notifications/context/SocketContext'
import { NotificationPopover } from '@/features/notifications/ui/NotificationPopover'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { useIntersectionObserver } from '@/shared/hooks/useIntersectionObserver'
import { useEffect, useRef } from 'react'

export const PaymentNotifications = () => {
  const { data } = useGetNotificationsQuery({ cursor: undefined })
  const { notification } = useSocket()
  const [markAsRead] = useMarkNotificationAsReadMutation()
  const [fetchMoreNotifications] = useLazyGetNotificationsQuery()

  const handleMarkRead = useDebounce((ids: number[]) => {
    if (ids.length > 0) {
      markAsRead({ ids })
    }
  }, 300)

  const handleLoadNewPortion = async () => {
    const lastId = data?.items?.at(-1)?.id
    if (lastId) {
      await fetchMoreNotifications({ cursor: lastId }).unwrap()
    }
  }
  const hasMore = data ? data?.items?.length < data?.totalCount : true

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!notification) return

    const state = store.getState()
    // get all existing caches for 'getNotifications'
    const allQueries = notificationsApi.util.selectInvalidatedBy(state, [{ type: 'Notifications' }])

    // update each cache
    allQueries.forEach(({ originalArgs }) => {
      dispatch(
        notificationsApi.util.updateQueryData('getNotifications', originalArgs, (draft) => {
          const existingNotification = draft.items.find((item) => item.id === notification.id)
          if (!existingNotification) {
            draft.items.unshift(notification)
            draft.totalCount += 1
            if (!notification.isRead) {
              draft.notReadCount += 1
            }
          }
        })
      )
    })
  }, [notification, dispatch])

  return (
    <NotificationPopover
      notifications={data?.items}
      unreadCount={data?.notReadCount}
      onMarkAsRead={handleMarkRead}
      onNewPortionLoad={handleLoadNewPortion}
      hasMore={hasMore}
    />
  )
}
