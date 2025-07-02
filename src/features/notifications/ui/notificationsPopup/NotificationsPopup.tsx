import { useDispatch, useSelector } from 'react-redux'
import { RefObject, UIEvent, useCallback, useEffect, useMemo, useState } from 'react'

import {
  useGetNotificationsQuery,
  useDeleteNotificationMutation,
  useLazyGetNotificationsQuery,
  useMarkNotificationsAsReadMutation,
} from '@/features/notifications/api/notificationsApi'
import {
  markAsReadLocally,
  deleteLocally,
  clearRealtimeNotifications,
  decrementUnreadCount,
  setUnreadCount,
} from '@/features/notifications/store/notificationsSlice'
import { RootState } from '@/app/store/store'
import { Scroll } from '@/shared/ui'
import { useOutsideClick } from '@/shared/hooks/useOutsideClick'
import { Notification } from '../../api/notificationsApi.types'
import { NotificationHeader, NotificationsList } from './ui'

import s from './NotificationsPopup.module.scss'

type NotificationsPopupProps = {
  isOpen: boolean
  onClose: () => void
  anchorRef: RefObject<HTMLElement | null>
}

const NOTIFICATIONS_PAGE_SIZE = 20
const SCROLL_THRESHOLD = 100

export const NotificationsPopup = ({ isOpen, onClose, anchorRef }: NotificationsPopupProps) => {
  const dispatch = useDispatch()
  const { ref: popupRef } = useOutsideClick<HTMLDivElement>(() => onClose(), { enabled: isOpen })
  const [cursor, setCursor] = useState<number | undefined>(undefined)
  const [hasMorePages, setHasMorePages] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  const { realtimeNotifications } = useSelector((state: RootState) => state.notifications)

  const {
    data: notificationsData,
    isLoading: isInitialLoading,
    error: apiError,
    refetch,
  } = useGetNotificationsQuery({ pageSize: NOTIFICATIONS_PAGE_SIZE }, { skip: !isOpen })

  const [getMoreNotifications, { isLoading: isLoadingMore }] = useLazyGetNotificationsQuery()
  const [deleteNotificationMutation] = useDeleteNotificationMutation()
  const [markNotificationsAsReadMutation] = useMarkNotificationsAsReadMutation()

  const [allApiNotifications, setAllApiNotifications] = useState<Notification[]>([])

  const allNotifications = useMemo(() => {
    if (!isInitialized && allApiNotifications.length === 0) {
      return realtimeNotifications
    }

    const apiIds = new Set(allApiNotifications.map((n) => n.id))
    const newRealtimeNotifications = realtimeNotifications.filter((n) => !apiIds.has(n.id))

    const combined = [...newRealtimeNotifications, ...allApiNotifications]
      .filter((n, i, arr) => arr.findIndex((x) => x.id === n.id) === i)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return combined
  }, [allApiNotifications, realtimeNotifications, isInitialized])

  useEffect(() => {
    if (isOpen) {
      setCursor(undefined)
      setHasMorePages(true)
      setAllApiNotifications([])
      setIsInitialized(false)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen && notificationsData && !isInitialLoading && !isInitialized) {
      const items = notificationsData.items || []
      setAllApiNotifications(items)
      setIsInitialized(true)

      if (items.length > 0) {
        setCursor(items[items.length - 1]?.id)
      }
      setHasMorePages(items.length >= NOTIFICATIONS_PAGE_SIZE)

      if (realtimeNotifications.length > 0) {
        setTimeout(() => {
          dispatch(clearRealtimeNotifications())
        }, 100)
      }
    }
  }, [isOpen, notificationsData, isInitialLoading, isInitialized, realtimeNotifications.length, dispatch])

  useEffect(() => {
    if (notificationsData?.notReadCount !== undefined) {
      dispatch(setUnreadCount(notificationsData.notReadCount))
    }
  }, [notificationsData?.notReadCount, dispatch])

  useEffect(() => {
    if (!isOpen || !popupRef.current || !anchorRef.current) return

    const popup = popupRef.current
    const anchor = anchorRef.current
    const anchorRect = anchor.getBoundingClientRect()

    popup.style.top = `${anchorRect.bottom + 8}px`
    popup.style.right = `${window.innerWidth - anchorRect.right}px`
  }, [isOpen, anchorRef])

  const handleScroll = useCallback(
    async (event: UIEvent<HTMLDivElement>) => {
      const target = event.currentTarget
      const { scrollTop, scrollHeight, clientHeight } = target
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - SCROLL_THRESHOLD

      if (isNearBottom && hasMorePages && !isLoadingMore && cursor && isInitialized) {
        try {
          const result = await getMoreNotifications({
            cursor,
            pageSize: NOTIFICATIONS_PAGE_SIZE,
          }).unwrap()

          if (result.items.length > 0) {
            setAllApiNotifications((prev) => {
              const newItems = [...prev, ...result.items]
              return newItems
            })
            setCursor(result.items[result.items.length - 1].id)
            setHasMorePages(result.items.length >= NOTIFICATIONS_PAGE_SIZE)
          } else {
            setHasMorePages(false)
          }
        } catch (error) {
          console.error('Failed to load more notifications:', error)
          setHasMorePages(false)
        }
      }
    },
    [hasMorePages, isLoadingMore, cursor, getMoreNotifications, isInitialized]
  )

  const handleDelete = useCallback(
    async (id: number) => {
      const notification = allNotifications.find((n) => n.id === id)
      const wasUnread = notification && !notification.isRead

      // Optimistic update
      dispatch(deleteLocally(id))
      setAllApiNotifications((prev) => prev.filter((n) => n.id !== id))

      if (wasUnread) {
        dispatch(decrementUnreadCount(1))
      }

      try {
        await deleteNotificationMutation(id).unwrap()
      } catch (error) {
        console.error('Failed to delete notification:', error)
        refetch()
      }
    },
    [deleteNotificationMutation, dispatch, refetch, allNotifications]
  )

  const handleMarkAsRead = useCallback(
    async (id: number) => {
      const notification = allNotifications.find((n) => n.id === id)
      const wasUnread = notification && !notification.isRead

      // Optimistic update
      dispatch(markAsReadLocally([id]))
      setAllApiNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
      if (wasUnread) {
        dispatch(decrementUnreadCount(1))
      }

      try {
        await markNotificationsAsReadMutation({ ids: [id] }).unwrap()
      } catch (error) {
        console.error('Failed to mark notification as read:', error)
        refetch()
      }
    },
    [markNotificationsAsReadMutation, dispatch, refetch, allNotifications]
  )

  const handleMarkAllAsRead = useCallback(async () => {
    const unreadNotifications = allNotifications.filter((n) => !n.isRead)
    const unreadIds = unreadNotifications.map((n) => n.id)

    if (unreadIds.length === 0) return

    // Optimistic update
    dispatch(markAsReadLocally(unreadIds))
    setAllApiNotifications((prev) => prev.map((n) => (unreadIds.includes(n.id) ? { ...n, isRead: true } : n)))
    dispatch(setUnreadCount(0))

    try {
      await markNotificationsAsReadMutation({ ids: unreadIds }).unwrap()
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
      refetch()
    }
  }, [allNotifications, markNotificationsAsReadMutation, dispatch, refetch])

  if (!isOpen) return null

  const hasUnreadNotifications = allNotifications.some((n) => !n.isRead)

  return (
    <div ref={popupRef} className={s.popup}>
      <NotificationHeader onMarkAllAsRead={handleMarkAllAsRead} hasUnreadNotifications={hasUnreadNotifications} />

      <Scroll className={s.content} onScroll={handleScroll}>
        {isInitialLoading ? (
          <div className={s.loading}>Loading notifications...</div>
        ) : apiError ? (
          <div className={s.error}>
            <p>Failed to load notifications</p>
            <p>Please check your internet connection and try again</p>
          </div>
        ) : allNotifications.length === 0 ? (
          <div className={s.empty}>
            <p>No notifications yet</p>
          </div>
        ) : (
          <NotificationsList
            notifications={allNotifications}
            onDelete={handleDelete}
            onMarkAsRead={handleMarkAsRead}
            isLoadingMore={isLoadingMore}
            hasMore={hasMorePages}
          />
        )}
      </Scroll>
    </div>
  )
}
