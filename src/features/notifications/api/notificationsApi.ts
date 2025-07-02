import { joyfyApi } from '@/shared/api/joyfyApi'

import { NotificationsResponse } from './notificationsApi.types'

export const notificationsApi = joyfyApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<
      NotificationsResponse,
      {
        cursor?: number
        sortBy?: string
        isRead?: boolean
        pageSize?: number
        sortDirection?: 'asc' | 'desc'
      }
    >({
      query: ({ cursor, sortBy = 'createdAt', isRead, pageSize = 10, sortDirection = 'desc' }) => {
        return {
          url: `notifications${cursor ? `/${cursor}` : ''}`,
          params: { sortBy, isRead, pageSize, sortDirection },
        }
      },
      providesTags: (result, error, arg) => [
        { type: 'Notification', id: 'LIST' },
        ...(result?.items || []).map(({ id }) => ({ type: 'Notification' as const, id })),
      ],
    }),

    markNotificationsAsRead: builder.mutation({
      query: (body) => ({
        url: 'notifications/mark-as-read',
        method: 'PUT',
        body,
      }),
      async onQueryStarted(ids, { dispatch, queryFulfilled, getState }) {
        const patchResult = dispatch(
          notificationsApi.util.updateQueryData('getNotifications', { pageSize: 10 }, (draft) => {
            if (draft.items) {
              draft.items.forEach((item) => {
                if (Array.isArray(ids) ? ids.includes(item.id) : item.id === ids) {
                  item.isRead = true
                }
              })
              draft.notReadCount = Math.max(0, (draft.notReadCount || 0) - (Array.isArray(ids) ? ids.length : 1))
            }
          })
        )

        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
      invalidatesTags: [{ type: 'Notification', id: 'LIST' }],
    }),

    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `notifications/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          notificationsApi.util.updateQueryData('getNotifications', { pageSize: 10 }, (draft) => {
            if (draft.items) {
              const itemIndex = draft.items.findIndex((item) => item.id === id)
              if (itemIndex !== -1) {
                const deletedItem = draft.items[itemIndex]
                draft.items.splice(itemIndex, 1)
                if (!deletedItem.isRead) {
                  draft.notReadCount = Math.max(0, (draft.notReadCount || 0) - 1)
                }
              }
            }
          })
        )

        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
      invalidatesTags: (result, error, id) => [{ type: 'Notification', id }],
    }),
  }),
})

export const {
  useGetNotificationsQuery,
  useDeleteNotificationMutation,
  useLazyGetNotificationsQuery,
  useMarkNotificationsAsReadMutation,
} = notificationsApi
