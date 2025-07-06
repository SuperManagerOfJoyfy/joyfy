import { joyfyApi } from '@/shared/api/joyfyApi'
import { NotificationsResponse } from './notificationsApiTypes'

export const notificationsApi = joyfyApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<NotificationsResponse, { cursor?: string; pageSize?: number } | void>({
      query: (arg) => {
        const cursor = arg?.cursor ?? ''
        const pageSize = arg?.pageSize ?? 12
        return { url: `notifications/${cursor ?? ''}`, params: { pageSize } }
      },

      serializeQueryArgs: () => 'notifications',

      merge: (currentCache, newResponse) => {
        const existingIds = new Set(currentCache.items.map((n) => n.id))
        const newItems = newResponse.items.filter((n) => !existingIds.has(n.id))
        return {
          ...newResponse,
          items: [...currentCache.items, ...newItems],
        }
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
          notificationsApi.util.updateQueryData('getNotifications', undefined, (draft) => {
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
          notificationsApi.util.updateQueryData('getNotifications', { cursor: undefined }, (draft) => {
            draft.items.forEach((item) => {
              if (ids.includes(item.id)) item.isRead = true
            })
            draft.notReadCount = draft.items.filter((item) => !item.isRead).length
          })
        )

        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
      invalidatesTags: (result, error, ids) => [
        ...ids.map((id) => ({ type: 'Notifications' as const, id })),
        { type: 'Notifications', id: 'LIST' },
      ],
    }),
  }),
})

export const { useGetNotificationsQuery, useDeleteNotificationMutation, useMarkAsReadMutation } = notificationsApi
