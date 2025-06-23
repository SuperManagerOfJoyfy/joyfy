import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Notification } from '@/features/notifications/api/notificationsApi.types'

type NotificationsState = {
  unreadCount: number
  notifications: Notification[]
  isPopupOpen: boolean
  hasMore: boolean
  loading: boolean
  error: string | null
}

const initialState: NotificationsState = {
  unreadCount: 0,
  notifications: [],
  isPopupOpen: false,
  hasMore: true,
  loading: false,
  error: null,
}

// Helper function to remove duplicates
const removeDuplicates = (notifications: Notification[]): Notification[] => {
  const seen = new Set<number>()
  return notifications.filter((notification) => {
    if (seen.has(notification.id)) {
      return false
    }
    seen.add(notification.id)
    return true
  })
}

// Helper function to calculate unread count
const calculateUnreadCount = (notifications: Notification[]): number => {
  return notifications.filter((notification) => !notification.isRead).length
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload
    },

    incrementUnreadCount: (state) => {
      state.unreadCount += 1
    },

    decrementUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = Math.max(0, state.unreadCount - action.payload)
    },

    addNotification: (state, action: PayloadAction<Notification>) => {
      const existingIndex = state.notifications.findIndex((n) => n.id === action.payload.id)

      if (existingIndex === -1) {
        state.notifications.unshift(action.payload)
      } else {
        state.notifications[existingIndex] = action.payload
      }

      state.unreadCount = calculateUnreadCount(state.notifications)
    },

    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = removeDuplicates(action.payload)
      state.unreadCount = calculateUnreadCount(state.notifications)
    },

    appendNotifications: (state, action: PayloadAction<Notification[]>) => {
      const combined = [...state.notifications, ...action.payload]
      state.notifications = removeDuplicates(combined)
      state.unreadCount = calculateUnreadCount(state.notifications)
    },

    markAsRead: (state, action: PayloadAction<number[]>) => {
      const idsToMark = action.payload

      state.notifications.forEach((notification) => {
        if (idsToMark.includes(notification.id)) {
          notification.isRead = true
        }
      })

      state.unreadCount = calculateUnreadCount(state.notifications)
    },

    deleteNotification: (state, action: PayloadAction<number>) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload)
      state.unreadCount = calculateUnreadCount(state.notifications)
    },

    togglePopup: (state) => {
      state.isPopupOpen = !state.isPopupOpen
    },

    closePopup: (state) => {
      state.isPopupOpen = false
    },

    openPopup: (state) => {
      state.isPopupOpen = true
    },

    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },

    clearNotifications: (state) => {
      state.notifications = []
      state.hasMore = true
      state.unreadCount = 0
    },

    resetNotificationsOnOpen: (state) => {
      state.notifications = []
      state.hasMore = true
      state.loading = false
      state.error = null
    },
  },
})

export const {
  setUnreadCount,
  incrementUnreadCount,
  decrementUnreadCount,
  addNotification,
  setNotifications,
  appendNotifications,
  markAsRead,
  deleteNotification,
  togglePopup,
  closePopup,
  openPopup,
  setHasMore,
  setLoading,
  setError,
  clearNotifications,
  resetNotificationsOnOpen,
} = notificationsSlice.actions

export default notificationsSlice.reducer
