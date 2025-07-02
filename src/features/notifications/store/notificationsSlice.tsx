import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Notification } from '@/features/notifications/api/notificationsApi.types'

type NotificationsState = {
  isPopupOpen: boolean
  realtimeNotifications: Notification[]
  unreadCount: number
  lastUpdated: number | null
}

const initialState: NotificationsState = {
  isPopupOpen: false,
  realtimeNotifications: [],
  unreadCount: 0,
  lastUpdated: null,
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    togglePopup: (state) => {
      state.isPopupOpen = !state.isPopupOpen
    },

    closePopup: (state) => {
      state.isPopupOpen = false
    },

    setUnreadCount: (state, action: PayloadAction<number>) => {
      const newCount = action.payload
      const now = Date.now()

      if (state.unreadCount !== newCount) {
        state.unreadCount = newCount
        state.lastUpdated = now
      }
    },

    incrementUnreadCount: (state) => {
      state.unreadCount += 1
      state.lastUpdated = Date.now()
    },

    decrementUnreadCount: (state, action: PayloadAction<number>) => {
      const decrementBy = action.payload
      state.unreadCount = Math.max(0, state.unreadCount - decrementBy)
      state.lastUpdated = Date.now()
    },

    addRealtimeNotification: (state, action: PayloadAction<Notification>) => {
      const newNotification = action.payload

      const exists = state.realtimeNotifications.some((n) => {
        return (
          n.id === newNotification.id ||
          (Math.abs(new Date(n.createdAt).getTime() - new Date(newNotification.createdAt).getTime()) < 1000 &&
            n.message === newNotification.message)
        )
      })

      console.log('[Redux] Adding realtime notification:', {
        notification: newNotification,
        exists,
        currentCount: state.realtimeNotifications.length,
      })

      if (!exists) {
        state.realtimeNotifications.unshift(newNotification)
        if (!newNotification.isRead) {
          state.unreadCount += 1
          state.lastUpdated = Date.now()
        }
      }
    },

    clearRealtimeNotifications: (state) => {
      state.realtimeNotifications = []
    },

    markAsReadLocally: (state, action: PayloadAction<number[]>) => {
      const idsToMark = action.payload
      let markedCount = 0

      state.realtimeNotifications.forEach((notification) => {
        if (idsToMark.includes(notification.id) && !notification.isRead) {
          notification.isRead = true
          markedCount++
        }
      })

      if (markedCount > 0) {
        state.unreadCount = Math.max(0, state.unreadCount - markedCount)
        state.lastUpdated = Date.now()
      }
    },

    deleteLocally: (state, action: PayloadAction<number>) => {
      const notificationToDelete = state.realtimeNotifications.find((n) => n.id === action.payload)
      state.realtimeNotifications = state.realtimeNotifications.filter((n) => n.id !== action.payload)

      if (notificationToDelete && !notificationToDelete.isRead) {
        state.unreadCount = Math.max(0, state.unreadCount - 1)
        state.lastUpdated = Date.now()
      }
    },

    resetNotifications: (state) => {
      return initialState
    },
  },
})

export const {
  togglePopup,
  closePopup,
  setUnreadCount,
  incrementUnreadCount,
  decrementUnreadCount,
  addRealtimeNotification,
  clearRealtimeNotifications,
  markAsReadLocally,
  deleteLocally,
  resetNotifications,
} = notificationsSlice.actions

export default notificationsSlice.reducer
