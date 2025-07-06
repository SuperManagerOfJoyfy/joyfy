'use client'

import { RiDeleteBin6Line } from 'react-icons/ri'
import { MdOutlineMarkAsUnread } from 'react-icons/md'
import { DateStamp, Typography } from '@/shared/ui'
import { NotificationItemType } from '../api/notificationsApiTypes'

import s from './Notification.module.scss'

type Props = {
  notification: NotificationItemType
  onDelete: () => void
  onMarkAsRead: () => void
}

export const NotificationItem = ({ notification, onDelete, onMarkAsRead }: Props) => {
  const { isRead, message, createdAt } = notification

  return (
    <div className={s.notificationWrapper}>
      <div className={s.contentArea}>
        <Typography variant="body2" fontWeight="bold">
          New notification! {!isRead && <span className={s.tag}>New</span>}
        </Typography>
        <Typography variant="body2">{message}</Typography>
        <DateStamp date={createdAt} />
      </div>
      <div className={s.actionsArea}>
        <RiDeleteBin6Line title="delete" className={s.icon} onClick={onDelete} />

        <MdOutlineMarkAsUnread title="mark as read" className={s.icon} onClick={onMarkAsRead} />
      </div>
    </div>
  )
}
