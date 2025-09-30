'use client'

import { DateStamp, Typography } from '@/shared/ui'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { NotificationItemType } from '@/features/notifications/api'
import { useTranslations } from 'next-intl'
import s from './Notification.module.scss'

type Props = {
  notification: NotificationItemType
  onDelete: () => void
}

export const NotificationItem = ({ notification, onDelete }: Props) => {
  const t = useTranslations('notifications')
  const { isRead, message, createdAt } = notification

  return (
    <div className={s.notificationWrapper}>
      <div className={s.contentArea}>
        {!isRead && (
          <Typography variant="body2" fontWeight="bold">
            {t('newPrefix')} <span className={s.tag}>{t('newTag')}</span>
          </Typography>
        )}
        <Typography variant="body2">{message}</Typography>
        <DateStamp date={createdAt} />
      </div>
      <div className={s.actionsArea}>
        <RiDeleteBin6Line title={t('delete')} className={s.icon} onClick={onDelete} />
      </div>
    </div>
  )
}
