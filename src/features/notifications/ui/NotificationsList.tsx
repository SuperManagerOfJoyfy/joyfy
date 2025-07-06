'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Loader, Scroll, Separator, Typography } from '@/shared/ui'
import { NotificationItem } from './NotificationItem'
import { useDeleteNotificationMutation, useGetNotificationsQuery, useMarkAsReadMutation } from '../api/notificationsApi'
import s from './Notification.module.scss'

export const NotificationsList = () => {
  const [cursor, setCursor] = useState<string | undefined>(undefined)
  const [deleteNotification] = useDeleteNotificationMutation()
  const [markAsRead] = useMarkAsReadMutation()

  const { data, isFetching } = useGetNotificationsQuery({ cursor, pageSize: 12 })

  const notifications = data?.items ?? []

  const observerRef = useRef<HTMLDivElement | null>(null)

  const lastItem = notifications[notifications.length - 1]

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries
      if (entry.isIntersecting && !isFetching && lastItem) {
        setCursor(lastItem.id.toString())
      }
    },
    [lastItem, isFetching]
  )

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '0px',
      threshold: 1.0,
    })

    if (observerRef.current) observer.observe(observerRef.current)

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current)
    }
  }, [handleObserver])

  const handleDelete = (id: number) => {
    deleteNotification(id)
  }
  const handleMarkAsRead = (id: number) => {
    markAsRead([id])
  }

  return (
    <div className={s.listWrapper}>
      <Typography variant="h3" className={s.listHeader}>
        Notifications
      </Typography>
      <Separator />
      <Scroll>
        {notifications.map((n) => (
          <React.Fragment key={n.id}>
            <NotificationItem
              notification={n}
              onDelete={() => handleDelete(n.id)}
              onMarkAsRead={() => handleMarkAsRead(n.id)}
            />
            <Separator />
          </React.Fragment>
        ))}
        <div ref={observerRef} style={{ height: 1 }} className={s.loader} />

        {isFetching && <Loader reduced />}
      </Scroll>
    </div>
  )
}
