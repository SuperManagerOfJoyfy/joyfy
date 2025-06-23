// import { useEffect, useRef, useCallback, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { IoCheckmarkDoneOutline } from 'react-icons/io5'
// import {
//   useGetNotificationsQuery,
//   useDeleteNotificationMutation,
//   useLazyGetNotificationsQuery,
//   useMarkNotificationsAsReadMutation,
// } from '@/features/notifications/api/notificationsApi'
// import {
//   setNotifications,
//   appendNotifications,
//   deleteNotification as deleteNotificationAction,
//   markAsRead,
//   setHasMore,
//   setLoading,
//   setError,
//   setUnreadCount,
//   resetNotificationsOnOpen,
// } from '@/features/notifications/store/notificationsSlice'
// import { NotificationItem } from '../notificationItem/NotificationItem'
// import { RootState } from '@/app/store/store'
// import { Button, Scroll } from '@/shared/ui'
// import s from './NotificationsPopup.module.scss'

// type NotificationsPopupProps = {
//   isOpen: boolean
//   onClose: () => void
//   anchorRef: React.RefObject<HTMLElement | null>
// }

// export const NotificationsPopup = ({ isOpen, onClose, anchorRef }: NotificationsPopupProps) => {
//   const dispatch = useDispatch()
//   const popupRef = useRef<HTMLDivElement>(null)
//   const contentRef = useRef<HTMLDivElement>(null)
//   const [cursor, setCursor] = useState<number | undefined>(undefined)

//   const { notifications, hasMore, loading } = useSelector((state: RootState) => state.notifications)

//   const {
//     data: initialData,
//     isLoading: isInitialLoading,
//     error: apiError,
//   } = useGetNotificationsQuery({ pageSize: 20 }, { skip: !isOpen })

//   const [getMoreNotifications, { isLoading: isLoadingMore }] = useLazyGetNotificationsQuery()
//   const [deleteNotificationMutation] = useDeleteNotificationMutation()
//   const [markNotificationsAsReadMutation] = useMarkNotificationsAsReadMutation()

//   useEffect(() => {
//     if (isOpen) {
//       dispatch(resetNotificationsOnOpen())
//       setCursor(undefined)
//     }
//   }, [isOpen, dispatch])

//   useEffect(() => {
//     if (isOpen && initialData && !isInitialLoading) {
//       dispatch(setNotifications(initialData.items))
//       dispatch(setHasMore(initialData.items.length >= 20))

//       if (initialData.items.length > 0) {
//         setCursor(initialData.items[initialData.items.length - 1]?.id)
//       }
//     }
//   }, [isOpen, initialData, isInitialLoading, dispatch])

//   useEffect(() => {
//     if (apiError) {
//       dispatch(setError('Failed to load notifications'))
//     }
//   }, [apiError, dispatch])

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         popupRef.current &&
//         !popupRef.current.contains(event.target as Node) &&
//         anchorRef.current &&
//         !anchorRef.current.contains(event.target as Node)
//       ) {
//         onClose()
//       }
//     }

//     if (isOpen) {
//       document.addEventListener('mousedown', handleClickOutside)
//       return () => document.removeEventListener('mousedown', handleClickOutside)
//     }
//   }, [isOpen, onClose, anchorRef])

//   useEffect(() => {
//     if (isOpen && popupRef.current && anchorRef.current) {
//       const popup = popupRef.current
//       const anchor = anchorRef.current
//       const anchorRect = anchor.getBoundingClientRect()

//       popup.style.top = `${anchorRect.bottom + 8}px`
//       popup.style.right = `${window.innerWidth - anchorRect.right}px`
//     }
//   }, [isOpen, anchorRef])

//   const handleScroll = useCallback(async () => {
//     if (!contentRef.current || !hasMore || loading || isLoadingMore) return

//     const { scrollTop, scrollHeight, clientHeight } = contentRef.current
//     const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100

//     if (isNearBottom && cursor) {
//       try {
//         dispatch(setLoading(true))
//         const result = await getMoreNotifications({ cursor, pageSize: 20 }).unwrap()

//         if (result.items.length > 0) {
//           dispatch(appendNotifications(result.items))
//           setCursor(result.items[result.items.length - 1].id)
//         }

//         dispatch(setHasMore(result.items.length >= 20))
//       } catch {
//         dispatch(setError('Failed to load more notifications'))
//       } finally {
//         dispatch(setLoading(false))
//       }
//     }
//   }, [hasMore, loading, isLoadingMore, cursor, getMoreNotifications, dispatch])

//   const handleDelete = async (id: number) => {
//     try {
//       await deleteNotificationMutation(id).unwrap()
//       dispatch(deleteNotificationAction(id))
//     } catch {
//       dispatch(setError('Failed to delete notification'))
//     }
//   }

//   const handleMarkAsRead = async (id: number) => {
//     try {
//       await markNotificationsAsReadMutation({ ids: [id] }).unwrap()
//       dispatch(markAsRead([id]))
//     } catch {
//       dispatch(markAsRead([id]))
//     }
//   }

//   const handleMarkAllAsRead = async () => {
//     const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n.id)
//     if (unreadIds.length > 0) {
//       try {
//         await markNotificationsAsReadMutation({ ids: unreadIds }).unwrap()
//         dispatch(markAsRead(unreadIds))
//       } catch {
//         dispatch(markAsRead(unreadIds))
//       }
//     }
//   }

//   if (!isOpen) return null

//   return (
//     <div ref={popupRef} className={s.popup}>
//       <div className={s.header}>
//         <h3 className={s.title}>Notifications</h3>
//         <div className={s.actions}>
//           <Button
//             variant="icon"
//             className={s.actionButton}
//             onClick={handleMarkAllAsRead}
//             title="Mark all as read"
//             disabled={notifications.every((n) => n.isRead)}
//           >
//             <IoCheckmarkDoneOutline />
//           </Button>
//         </div>
//       </div>

//       <Scroll className={`verticalContainer ${s.content}`} ref={contentRef} onScroll={handleScroll}>
//         <div className="verticalContainer">
//           {isInitialLoading ? (
//             <div className={s.loading}>Loading notifications...</div>
//           ) : apiError ? (
//             <div className={s.error}>
//               <p>Failed to load notifications</p>
//               <p>Please check your internet connection and try again</p>
//             </div>
//           ) : notifications.length === 0 ? (
//             <div className={s.empty}>
//               <p>No notifications yet</p>
//             </div>
//           ) : (
//             <>
//               {notifications
//                 .filter((n, i, arr) => arr.findIndex((x) => x.id === n.id) === i)
//                 .map((notification) => (
//                   <NotificationItem
//                     key={`notification-${notification.id}-${notification.createdAt}`}
//                     notification={notification}
//                     onDelete={handleDelete}
//                     onMarkAsRead={handleMarkAsRead}
//                   />
//                 ))}

//               {isLoadingMore && <div className={s.loadingMore}>Loading more...</div>}
//               {!hasMore && notifications.length > 0 && (
//                 <div className={s.endMessage}>That's all notifications for the last month</div>
//               )}
//             </>
//           )}
//         </div>
//       </Scroll>
//     </div>
//   )
// }
// NotificationsPopup.tsx (fixed)
import { useEffect, useRef, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IoCheckmarkDoneOutline } from 'react-icons/io5'
import {
  useGetNotificationsQuery,
  useDeleteNotificationMutation,
  useLazyGetNotificationsQuery,
  useMarkNotificationsAsReadMutation,
} from '@/features/notifications/api/notificationsApi'
import {
  setNotifications,
  appendNotifications,
  deleteNotification as deleteNotificationAction,
  markAsRead,
  setHasMore,
  setLoading,
  setError,
  resetNotificationsOnOpen,
} from '@/features/notifications/store/notificationsSlice'
import { NotificationItem } from '../notificationItem/NotificationItem'
import { RootState } from '@/app/store/store'
import { Button, Scroll } from '@/shared/ui'
import s from './NotificationsPopup.module.scss'

interface NotificationsPopupProps {
  isOpen: boolean
  onClose: () => void
  anchorRef: React.RefObject<HTMLElement | null>
}

export const NotificationsPopup = ({ isOpen, onClose, anchorRef }: NotificationsPopupProps) => {
  const dispatch = useDispatch()
  const popupRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [cursor, setCursor] = useState<number | undefined>(undefined)

  const { notifications, hasMore, loading } = useSelector((state: RootState) => state.notifications)

  const {
    data: initialData,
    isLoading: isInitialLoading,
    error: apiError,
  } = useGetNotificationsQuery({ pageSize: 20 }, { skip: !isOpen })

  const [getMoreNotifications, { isLoading: isLoadingMore }] = useLazyGetNotificationsQuery()
  const [deleteNotificationMutation] = useDeleteNotificationMutation()
  const [markNotificationsAsReadMutation] = useMarkNotificationsAsReadMutation()

  useEffect(() => {
    if (isOpen) {
      dispatch(resetNotificationsOnOpen())
      setCursor(undefined)
    }
  }, [isOpen, dispatch])

  useEffect(() => {
    if (isOpen && initialData && !isInitialLoading) {
      dispatch(setNotifications(initialData.items))
      dispatch(setHasMore(initialData.items.length >= 20))

      if (initialData.items.length > 0) {
        setCursor(initialData.items[initialData.items.length - 1]?.id)
      }
    }
  }, [isOpen, initialData, isInitialLoading, dispatch])

  useEffect(() => {
    if (apiError) {
      dispatch(setError('Failed to load notifications'))
    }
  }, [apiError, dispatch])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose, anchorRef])

  useEffect(() => {
    if (isOpen && popupRef.current && anchorRef.current) {
      const popup = popupRef.current
      const anchor = anchorRef.current
      const anchorRect = anchor.getBoundingClientRect()

      popup.style.top = `${anchorRect.bottom + 8}px`
      popup.style.right = `${window.innerWidth - anchorRect.right}px`
    }
  }, [isOpen, anchorRef])

  const handleScroll = useCallback(
    async (event: React.UIEvent<HTMLDivElement>) => {
      const target = event.currentTarget
      const { scrollTop, scrollHeight, clientHeight } = target
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100

      if (isNearBottom && hasMore && !loading && !isLoadingMore && cursor) {
        try {
          dispatch(setLoading(true))
          const result = await getMoreNotifications({ cursor, pageSize: 20 }).unwrap()

          if (result.items.length > 0) {
            dispatch(appendNotifications(result.items))
            setCursor(result.items[result.items.length - 1].id)
          }

          dispatch(setHasMore(result.items.length >= 20))
        } catch {
          dispatch(setError('Failed to load more notifications'))
        } finally {
          dispatch(setLoading(false))
        }
      }
    },
    [hasMore, loading, isLoadingMore, cursor, getMoreNotifications, dispatch]
  )

  const handleDelete = async (id: number) => {
    try {
      await deleteNotificationMutation(id).unwrap()
      dispatch(deleteNotificationAction(id))
    } catch {
      dispatch(setError('Failed to delete notification'))
    }
  }

  const handleMarkAsRead = async (id: number) => {
    try {
      await markNotificationsAsReadMutation({ ids: [id] }).unwrap()
      dispatch(markAsRead([id]))
    } catch {
      dispatch(markAsRead([id]))
    }
  }

  const handleMarkAllAsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n.id)
    if (unreadIds.length > 0) {
      try {
        await markNotificationsAsReadMutation({ ids: unreadIds }).unwrap()
        dispatch(markAsRead(unreadIds))
      } catch {
        dispatch(markAsRead(unreadIds))
      }
    }
  }

  if (!isOpen) return null

  return (
    <div ref={popupRef} className={s.popup}>
      <div className={s.header}>
        <h3 className={s.title}>Notifications</h3>
        <div className={s.actions}>
          <Button
            variant="icon"
            className={s.actionButton}
            onClick={handleMarkAllAsRead}
            title="Mark all as read"
            disabled={notifications.every((n) => n.isRead)}
          >
            <IoCheckmarkDoneOutline />
          </Button>
        </div>
      </div>

      <Scroll className={s.content} onScroll={handleScroll}>
        {isInitialLoading ? (
          <div className={s.loading}>Loading notifications...</div>
        ) : apiError ? (
          <div className={s.error}>
            <p>Failed to load notifications</p>
            <p>Please check your internet connection and try again</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className={s.empty}>
            <p>No notifications yet</p>
          </div>
        ) : (
          <>
            {notifications
              .filter((n, i, arr) => arr.findIndex((x) => x.id === n.id) === i)
              .map((notification) => (
                <NotificationItem
                  key={`notification-${notification.id}-${notification.createdAt}`}
                  notification={notification}
                  onDelete={handleDelete}
                  onMarkAsRead={handleMarkAsRead}
                />
              ))}

            {isLoadingMore && <div className={s.loadingMore}>Loading more...</div>}
            {!hasMore && notifications.length > 0 && (
              <div className={s.endMessage}>That's all notifications for the last month</div>
            )}
          </>
        )}
      </Scroll>
    </div>
  )
}
