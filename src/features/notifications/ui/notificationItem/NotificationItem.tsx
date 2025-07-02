import { IoTrashOutline } from 'react-icons/io5'
import clsx from 'clsx'
import { MouseEvent } from 'react'

import { Button, DateStamp } from '@/shared/ui'
import { Notification } from '@/features/notifications/api/notificationsApi.types'

import s from './NotificationItem.module.scss'

type NotificationItemProps = {
  notification: Notification
  onDelete?: (id: number) => void
  onMarkAsRead?: (id: number) => void
  className?: string
}

export const NotificationItem = ({ notification, onDelete, onMarkAsRead, className }: NotificationItemProps) => {
  const handleDelete = (e: MouseEvent) => {
    e.stopPropagation()
    onDelete?.(notification.id)
  }

  const handleClick = () => {
    if (!notification.isRead) {
      onMarkAsRead?.(notification.id)
    }
  }

  const title = notification.message || ''

  return (
    <div className={clsx(s.notificationItem, !notification.isRead && s.unread, className)} onClick={handleClick}>
      <div className={s.content}>
        <div className={s.header}>
          <div className={clsx(s.title, !notification.isRead && s.newTitle)}>
            {!notification.isRead && (
              <div className={s.newContainer}>
                <span className={s.newNot}>New notification!</span>
                <span className={s.newBadge}>New</span>
              </div>
            )}
            {title}
          </div>
          <Button
            variant={'icon'}
            className={s.deleteButton}
            onClick={handleDelete}
            aria-label="Delete notification"
            title="Delete"
          >
            <IoTrashOutline />
          </Button>
        </div>

        <DateStamp date={notification.createdAt} className={s.date} />
      </div>

      {!notification.isRead && <div className={s.unreadIndicator} />}
    </div>
  )
}
