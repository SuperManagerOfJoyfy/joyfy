import * as Popover from '@radix-ui/react-popover'
import { IoNotificationsOutline } from 'react-icons/io5'
import s from './NotificationPopover.module.scss'
import { Typography } from '@/shared/ui/typography'
import { Scroll } from '@/shared/ui'
import { NotificationItemType } from '@/features/notifications/api/notificationsApi.types'
import { useEffect, useRef, useState } from 'react'
import { NotificationItem } from '@/features/notifications/ui/NotificationItem'
import { ArrowIcon } from '@/shared/ui/icons/ArrowIcon'
import { NotificationsLoader } from '@/features/notifications/ui/NotificationsLoader'

type Props = {
  notifications: NotificationItemType[] | undefined
  unreadCount: number | undefined
  onMarkAsRead: (ids: number[]) => void
  onNewPortionLoad: () => Promise<void>
  hasMore: boolean
}

export const NotificationPopover = ({ notifications, unreadCount, onMarkAsRead, onNewPortionLoad, hasMore }: Props) => {
  const [visibleUnreadIds, setVisibleUnreadIds] = useState<Set<number>>(new Set())
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const addVisibleUnreadId = (id: number) => {
    setVisibleUnreadIds((prev) => {
      if (prev.has(id)) return prev
      const updated = new Set(prev)
      updated.add(id)
      return updated
    })
  }

  useEffect(() => {
    if (isPopoverOpen && visibleUnreadIds.size > 0) {
      onMarkAsRead(Array.from(visibleUnreadIds))
      setVisibleUnreadIds(new Set())
    }
  }, [isPopoverOpen, visibleUnreadIds])

  return (
    <Popover.Root open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <Popover.Trigger className={s.trigger}>
        <IoNotificationsOutline />
        {unreadCount && unreadCount > 0 ? <span className={s.number}>{unreadCount}</span> : null}
      </Popover.Trigger>
      <Popover.Anchor />
      <Popover.Portal>
        <Popover.Content className={s.popoverContent} sideOffset={15} align="end">
          <Scroll className={s.scrollWrapper}>
            <div className={s.scrollContent}>
              <Typography className={s.title} fontWeight="bold">
                Notifications
              </Typography>
              {notifications?.map((el) => (
                <NotificationItem
                  key={el.id}
                  notification={el}
                  onVisible={(id) => {
                    if (!el.isRead) addVisibleUnreadId(id)
                  }}
                />
              ))}
              <NotificationsLoader onNewPortionLoad={onNewPortionLoad} hasMore={hasMore} />
            </div>
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
