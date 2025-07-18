import { joyfyApi } from '@/shared/api/joyfyApi'
import { NotificationsRequest, NotificationsResponse } from './notificationsApi.types'

export const notificationsApi = joyfyApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<NotificationsResponse, NotificationsRequest>({
      query: ({ cursor }) => {
        return { url: `notifications/${cursor ?? ''}` }
      },

      serializeQueryArgs: ({ endpointName }) => endpointName,

      merge: (currentCache, newItems) => {
        currentCache.items.push(...newItems.items.filter((i) => !currentCache.items.some((c) => c.id === i.id)))
        currentCache.totalCount = newItems.totalCount
        currentCache.notReadCount = newItems.notReadCount
      },

      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.cursor !== previousArg?.cursor
      },

      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: 'Notifications' as const, id })),
              { type: 'Notifications', id: 'LIST' },
            ]
          : [{ type: 'Notifications', id: 'LIST' }],
    }),

    deleteNotification: builder.mutation<void, number>({
      query: (id) => ({
        url: `notifications/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        // Update the main cache entry (cursor: undefined)
        const patchResult = dispatch(
          notificationsApi.util.updateQueryData('getNotifications', { cursor: undefined }, (draft) => {
            const itemIndex = draft.items.findIndex((n) => n.id === id)
            if (itemIndex !== -1) {
              const deletedItem = draft.items[itemIndex]
              draft.items.splice(itemIndex, 1)
              draft.totalCount = Math.max(0, draft.totalCount - 1)

              // Also update notReadCount if the deleted item was unread
              if (deletedItem && !deletedItem.isRead) {
                draft.notReadCount = Math.max(0, draft.notReadCount - 1)
              }
            }
          })
        )

        try {
          await queryFulfilled
        } catch (error) {
          patchResult.undo()
        }
      },
    }),

    markAsRead: builder.mutation<void, number[]>({
      query: (ids) => ({
        url: 'notifications/mark-as-read',
        method: 'PUT',
        body: { ids },
      }),

      async onQueryStarted(ids, { dispatch, queryFulfilled }) {
        // Optimistic update: mark selected notifications as read
        const patchResult = dispatch(
          notificationsApi.util.updateQueryData('getNotifications', {}, (draft) => {
            draft.items.forEach((item) => {
              if (ids.includes(item.id)) item.isRead = true
            })

            draft.notReadCount = Math.max(0, (draft.notReadCount || 0) - (Array.isArray(ids) ? ids.length : 1))
          })
        )

        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },

      invalidatesTags: [{ type: 'Notifications', id: 'LIST' }],
    }),
  }),
})

export const {
  useGetNotificationsQuery,
  useLazyGetNotificationsQuery,
  useDeleteNotificationMutation,
  useMarkAsReadMutation,
} = notificationsApi
