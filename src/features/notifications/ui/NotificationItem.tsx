'use client'

import { DateStamp, Typography } from '@/shared/ui'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { NotificationItemType } from '@/features/notifications/api'

import s from './Notification.module.scss'

type Props = {
  notification: NotificationItemType
  onDelete: () => void
}

export const NotificationItem = ({ notification, onDelete }: Props) => {
  const { isRead, message, createdAt } = notification

  return (
    <div className={s.notificationWrapper}>
      <div className={s.contentArea}>
        {!isRead && (
          <Typography variant="body2" fontWeight="bold">
            New notification! <span className={s.tag}>New</span>
          </Typography>
        )}
        <Typography variant="body2">{message}</Typography>
        <DateStamp date={createdAt} />
      </div>
      <div className={s.actionsArea}>
        <RiDeleteBin6Line title="delete" className={s.icon} onClick={onDelete} />
      </div>
    </div>
  )
}
