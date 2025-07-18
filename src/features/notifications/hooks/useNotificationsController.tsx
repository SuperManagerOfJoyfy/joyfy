'use client'
import { RootState, useAppDispatch } from '@/app/store/store'
import { useCallback, useMemo } from 'react'
import { useStore } from 'react-redux'
import {
  notificationsApi,
  useDeleteNotificationMutation,
  useGetNotificationsQuery,
  useLazyGetNotificationsQuery,
  useMarkAsReadMutation,
} from '../api/notificationsApi'

export const useNotificationsController = () => {
  const store = useStore<RootState>()
  const { data: notificationsData } = useGetNotificationsQuery({ cursor: undefined })
  const [fetchMore, { isFetching: isLoadingMore }] = useLazyGetNotificationsQuery()
  const [deleteNotification] = useDeleteNotificationMutation()
  const [markAsRead] = useMarkAsReadMutation()

  const notifications = useMemo(() => {
    const items = notificationsData?.items || []

    // Sort manually (newest first)
    return [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [notificationsData?.items])

  const notReadCount = useMemo(() => notificationsData?.notReadCount || 0, [notificationsData?.notReadCount])

  const hasMore = notificationsData ? notifications.length < notificationsData.totalCount : false

  const onMarkAsRead = () => {
    const state = store.getState()
    const notifications = notificationsApi.endpoints.getNotifications.select({})(state)

    const unreadIds = notifications?.data?.items?.filter((n) => !n.isRead).map((n) => n.id) || []

    if (unreadIds.length > 0) {
      markAsRead(unreadIds)
    }
  }

  const onDeleteNotification = async (id: number) => {
    try {
      await deleteNotification(id).unwrap()
    } catch (err) {
      console.error('Error deleting notification:', err)
    }
  }

  const handleFetchMore = useCallback(async () => {
    const lastId = notifications.at(-1)?.id

    if (lastId) {
      try {
        await fetchMore({ cursor: lastId }).unwrap()
      } catch (err) {
        console.error('Error loading more notifications:', err)
      }
    }
  }, [notificationsData, fetchMore])

  return {
    notifications,
    notReadCount,
    isLoadingMore,
    onMarkAsRead,
    hasMore,
    handleFetchMore,
    onDeleteNotification,
  }
}
