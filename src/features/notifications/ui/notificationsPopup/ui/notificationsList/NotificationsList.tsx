import { Notification } from '@/features/notifications/api/notificationsApi.types'
import { NotificationItem } from '../../../notificationItem'

import s from './NotificationsList.module.scss'

type NotificationsListProps = {
  notifications: Notification[]
  onDelete: (id: number) => void
  onMarkAsRead: (id: number) => void
  isLoadingMore: boolean
  hasMore: boolean
}

export const NotificationsList = ({
  notifications,
  onDelete,
  onMarkAsRead,
  isLoadingMore,
  hasMore,
}: NotificationsListProps) => (
  <>
    {notifications.map((notification) => (
      <NotificationItem
        key={`notification-${notification.id}-${notification.createdAt}`}
        notification={notification}
        onDelete={onDelete}
        onMarkAsRead={onMarkAsRead}
      />
    ))}

    {isLoadingMore && <div className={s.loadingMore}>Loading more...</div>}

    {!hasMore && notifications.length > 0 && (
      <div className={s.endMessage}>That's all notifications for the last month</div>
    )}
  </>
)
