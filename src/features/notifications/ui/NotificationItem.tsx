import { NotificationItemType } from '@/features/notifications/api/notificationsApi.types'
import { useIntersectionObserver } from '@/shared/hooks/useIntersectionObserver'
import { DateStamp, Separator, Typography } from '@/shared/ui'
import { useEffect } from 'react'
import s from './NotificationPopover.module.scss'
import { IoMdClose } from 'react-icons/io'
import { useDeleteNotificationMutation } from '@/features/notifications/api/notificationsApi.'

export const NotificationItem = ({
  notification,
  onVisible,
}: {
  notification: NotificationItemType
  onVisible: (id: number) => void
}) => {
  const [ref, isVisible] = useIntersectionObserver<HTMLDivElement>({ threshold: 0.7 })
  const [deleteNotification] = useDeleteNotificationMutation()

  useEffect(() => {
    if (isVisible) {
      onVisible(notification.id)
    }
  }, [isVisible])

  return (
    <div className={s.notificationWrapper} ref={ref}>
      <button className={s.deleteButton} onClick={() => deleteNotification(notification.id)}>
        <IoMdClose />
      </button>
      <Separator />
      <Typography fontWeight="bold" className={s.newNotification}>
        New Notification! {!notification.isRead && <span>New</span>}
      </Typography>
      <Typography variant="body2">{notification.message}</Typography>
      <DateStamp date={notification.createdAt} className={s.timeStamp} />
    </div>
  )
}
