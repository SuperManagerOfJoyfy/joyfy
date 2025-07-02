import { IoCheckmarkDoneOutline } from 'react-icons/io5'
import { Button } from '@/shared/ui'

import s from './NotificationHeader.module.scss'

type NotificationHeaderProps = {
  onMarkAllAsRead: () => void
  hasUnreadNotifications: boolean
}

export const NotificationHeader = ({ onMarkAllAsRead, hasUnreadNotifications }: NotificationHeaderProps) => (
  <div className={s.header}>
    <h3 className={s.title}>Notifications</h3>
    <div className={s.actions}>
      <Button
        variant="icon"
        className={s.actionButton}
        onClick={onMarkAllAsRead}
        title="Mark all as read"
        disabled={!hasUnreadNotifications}
      >
        <IoCheckmarkDoneOutline />
      </Button>
    </div>
  </div>
)
