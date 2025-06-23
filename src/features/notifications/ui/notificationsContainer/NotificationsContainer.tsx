import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IoNotificationsOutline } from 'react-icons/io5'
import clsx from 'clsx'

import {
  togglePopup,
  closePopup,
  addNotification,
  setError,
  incrementUnreadCount,
} from '@/features/notifications/store/notificationsSlice'
import { RootState } from '@/app/store/store'
import { useNotificationWebSocket } from '../../hooks/useNotificationWebSocket'
import { NotificationsPopup } from '../notificationsPopup/NotificationsPopup'
import { Button } from '@/shared/ui'

import s from './NotificationsContainer.module.scss'
import { Notification } from '../../api/notificationsApi.types'

type NotificationsContainerProps = {
  accessToken?: string
  className?: string
}

export const NotificationsContainer = ({ accessToken, className }: NotificationsContainerProps) => {
  if (!accessToken) return null

  const dispatch = useDispatch()
  const bellRef = useRef<HTMLElement | null>(null)

  const { unreadCount, isPopupOpen } = useSelector((state: RootState) => state.notifications)

  const handleNotificationReceived = (notification: Notification) => {
    dispatch(addNotification(notification))
    if (!notification.isRead && !isPopupOpen) {
      dispatch(incrementUnreadCount())
    }
  }

  const handleWebSocketError = (error: Error) => {
    console.error('WebSocket error:', error)
    dispatch(setError(error.message || 'WebSocket connection error'))
  }

  const { isConnected } = useNotificationWebSocket({
    accessToken,
    onNotificationReceived: handleNotificationReceived,
    onError: handleWebSocketError,
  })

  useEffect(() => {
    const onEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPopupOpen) {
        dispatch(closePopup())
      }
    }

    document.addEventListener('keydown', onEscKey)
    return () => document.removeEventListener('keydown', onEscKey)
  }, [isPopupOpen, dispatch])

  const label = unreadCount > 0 ? `Notifications (${unreadCount} unread)` : 'Notifications'

  return (
    <div className={clsx(s.notificationsContainer, className)}>
      <Button
        variant="icon"
        ref={bellRef}
        className={clsx(s.bellButton, {
          [s.hasUnread]: unreadCount > 0,
        })}
        onClick={() => dispatch(togglePopup())}
        aria-label={label}
        title={label}
      >
        <IoNotificationsOutline className={s.bellIcon} />
        {unreadCount > 0 && <span className={s.badge}>{unreadCount > 99 ? '99+' : unreadCount}</span>}
      </Button>

      <div
        className={clsx(s.connectionStatus, {
          [s.connected]: isConnected,
        })}
      />

      {isPopupOpen && (
        <NotificationsPopup isOpen={isPopupOpen} onClose={() => dispatch(closePopup())} anchorRef={bellRef} />
      )}
    </div>
  )
}
