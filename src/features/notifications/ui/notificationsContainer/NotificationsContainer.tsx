import { useEffect, useRef, MouseEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IoNotificationsOutline } from 'react-icons/io5'
import clsx from 'clsx'

import { togglePopup, closePopup, setUnreadCount } from '@/features/notifications/store/notificationsSlice'
import { RootState } from '@/app/store/store'
import { useNotificationWebSocket } from '../../hooks/useNotificationWebSocket'
import { NotificationsPopup } from '../notificationsPopup/NotificationsPopup'
import { Button } from '@/shared/ui'
import { useGetNotificationsQuery } from '../../api/notificationsApi'
import LocalStorage from '@/shared/utils/localStorage/localStorage'

import s from './NotificationsContainer.module.scss'

export const NotificationsContainer = () => {
  const dispatch = useDispatch()
  const bellRef = useRef<HTMLElement | null>(null)
  const { unreadCount, isPopupOpen } = useSelector((state: RootState) => state.notifications)

  const accessToken = LocalStorage.getToken()

  const { data: unreadCountData, refetch } = useGetNotificationsQuery(
    { pageSize: 1 },
    {
      skip: !accessToken,
      refetchOnMountOrArgChange: true,
    }
  )

  useEffect(() => {
    if (unreadCountData?.notReadCount !== undefined && unreadCountData.notReadCount !== unreadCount) {
      dispatch(setUnreadCount(unreadCountData.notReadCount))
    }
  }, [unreadCountData?.notReadCount, dispatch, unreadCount])

  useNotificationWebSocket()

  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPopupOpen) {
        dispatch(closePopup())
      }
    }

    document.addEventListener('keydown', handleEscapeKey)
    return () => document.removeEventListener('keydown', handleEscapeKey)
  }, [isPopupOpen, dispatch])

  const handleBellMouseDown = (e: MouseEvent) => {
    e.preventDefault()
    if (!isPopupOpen) {
      refetch()
    }
    dispatch(togglePopup())
  }

  const handlePopupClose = () => dispatch(closePopup())

  const formatUnreadCount = () => (unreadCount > 99 ? '99+' : unreadCount.toString())
  const accessibilityLabel = unreadCount > 0 ? `Notifications (${unreadCount} unread)` : 'Notifications'

  if (!accessToken) return null

  return (
    <div className={s.notificationsContainer}>
      <Button
        variant="icon"
        ref={bellRef}
        className={clsx(s.bellButton, {
          [s.hasUnread]: unreadCount > 0,
          [s.isOpen]: isPopupOpen,
        })}
        onMouseDown={handleBellMouseDown}
        aria-label={accessibilityLabel}
        title={accessibilityLabel}
      >
        <IoNotificationsOutline className={s.bellIcon} />
        {unreadCount > 0 && (
          <span className={s.badge} aria-label={`${unreadCount} unread notifications`}>
            {formatUnreadCount()}
          </span>
        )}
      </Button>

      {isPopupOpen && <NotificationsPopup isOpen={isPopupOpen} onClose={handlePopupClose} anchorRef={bellRef} />}
    </div>
  )
}
