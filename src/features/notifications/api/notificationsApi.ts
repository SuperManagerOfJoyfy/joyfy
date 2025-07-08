import { joyfyApi } from '@/shared/api/joyfyApi'
import { NotificationsRequest, NotificationsResponse } from './notificationsApi.types'

export const notificationsApi = joyfyApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<NotificationsResponse, NotificationsRequest>({
      query: ({ cursor, sortBy = 'createdAt', isRead, pageSize = 10, sortDirection = 'desc' }) => {
        return { url: `notifications/${cursor ?? ''}`, params: { sortBy, isRead, pageSize, sortDirection } }
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
        // Optimistically update the cache
        const patchResult = dispatch(
          notificationsApi.util.updateQueryData('getNotifications', { pageSize: 10 }, (draft) => {
            draft.items = draft.items.filter((n) => n.id !== id)
          })
        )

        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
      invalidatesTags: (_result, _error, id) => [
        { type: 'Notifications', id },
        { type: 'Notifications', id: 'LIST' },
      ],
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
