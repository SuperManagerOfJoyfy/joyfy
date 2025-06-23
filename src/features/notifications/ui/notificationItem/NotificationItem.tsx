import { IoTrashOutline } from 'react-icons/io5'
import clsx from 'clsx'

import { DateStamp } from '@/shared/ui'
import { Notification } from '@/features/notifications/api/notificationsApi.types'

import s from './NotificationItem.module.scss'

type NotificationItemProps = {
  notification: Notification
  onDelete?: (id: number) => void
  onMarkAsRead?: (id: number) => void
  className?: string
}

export const NotificationItem = ({ notification, onDelete, onMarkAsRead, className }: NotificationItemProps) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete?.(notification.id)
  }

  const handleClick = () => {
    if (!notification.isRead) {
      onMarkAsRead?.(notification.id)
    }
  }

  const parseNotificationMessage = () => {
    const message = notification.message || ''

    const marker = 'New notification:'

    if (message.includes(marker)) {
      const splitMessage = message.split(marker)
      return {
        title: 'New notification',
        subtitle: splitMessage[1]?.trim() || '',
        isNew: true,
      }
    }

    return {
      title: message,
      subtitle: '',
      isNew: false,
    }
  }

  const { title, subtitle, isNew } = parseNotificationMessage()

  return (
    <div className={clsx(s.notificationItem, !notification.isRead && s.unread, className)} onClick={handleClick}>
      <div className={s.content}>
        <div className={s.header}>
          <span className={clsx(s.title, isNew && s.newTitle)}>
            {title}
            {isNew && <span className={s.newBadge}>New</span>}
          </span>
          <button className={s.deleteButton} onClick={handleDelete} aria-label="Delete notification" title="Delete">
            <IoTrashOutline />
          </button>
        </div>

        {subtitle && <div className={s.subtitle}>{subtitle}</div>}

        <DateStamp date={notification.createdAt} className={s.date} />
      </div>

      {!notification.isRead && <div className={s.unreadIndicator} />}
    </div>
  )
}
