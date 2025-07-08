import React from 'react'
import * as Popover from '@radix-ui/react-popover'
import { IoCheckmarkDoneOutline, IoNotificationsOutline } from 'react-icons/io5'
import { ArrowIcon, Button, Loader, Scroll, Separator, Typography } from '@/shared/ui'
import { useNotificationsController } from '../hooks'
import { NotificationItem } from './NotificationItem'
import { NotificationsLoader } from './NotificationsLoader'

import s from './Notification.module.scss'

export const NotificationsPopover = () => {
  const { notifications, notReadCount, isLoadingMore, onMarkAsRead, hasMore, handleFetchMore, deleteNotification } =
    useNotificationsController()

  return (
    <Popover.Root>
      <Popover.Trigger className={s.trigger}>
        <IoNotificationsOutline />
        {notReadCount > 0 && <span className={s.badge}>{notReadCount}</span>}
      </Popover.Trigger>
      <Popover.Anchor />
      <Popover.Portal>
        <Popover.Content className={s.popoverContent} sideOffset={15} align="end">
          <div className={s.popoverHeader}>
            <Typography variant="h3" className={s.title}>
              Notifications
            </Typography>

            <Button
              variant="icon"
              className={s.actionButton}
              onClick={onMarkAsRead}
              title="Mark all as read"
              disabled={!notReadCount}
            >
              <IoCheckmarkDoneOutline />
            </Button>
          </div>
          <Separator />
          <Scroll className={s.scroll}>
            {notifications.map((n) => (
              <React.Fragment key={n.id}>
                <NotificationItem notification={n} onDelete={() => deleteNotification(n.id)} />
                <Separator />
              </React.Fragment>
            ))}

            <NotificationsLoader onLoadMore={handleFetchMore} hasMore={hasMore} />
            {hasMore && isLoadingMore ? <Loader reduced /> : null}
          </Scroll>

          <Popover.Arrow asChild>
            <div className={s.arrowContent}>
              <ArrowIcon />
            </div>
          </Popover.Arrow>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
