import {
  getNotificationsRequest,
  MarkAsReadRequestBody,
  NotificationsResponse,
} from '@/features/notifications/api/notificationsApi.types'
import { joyfyApi } from '@/shared/api/joyfyApi'

export const notificationsApi = joyfyApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<NotificationsResponse, getNotificationsRequest>({
      query: ({ cursor, ...rest }) => {
        const url = cursor !== undefined ? `notifications/${cursor}?pageSize=4` : `notifications?pageSize=4`
        return {
          url,
          params: rest,
        }
      },
      serializeQueryArgs: ({ endpointName }) => endpointName,
      merge(currentCache, newItems) {
        console.log('merge!!!', newItems)

        currentCache.items.push(...newItems.items)
        currentCache.totalCount = newItems.totalCount
        currentCache.notReadCount = newItems.notReadCount
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.cursor !== previousArg?.cursor
      },
      providesTags: ['Notifications'],
    }),
    markNotificationAsRead: builder.mutation<void, MarkAsReadRequestBody>({
      query: (payload) => ({
        url: '/notifications/mark-as-read',
        method: 'PUT',
        body: payload,
      }),
      async onQueryStarted({ ids }, { dispatch, queryFulfilled, getState }) {
        const allQueries = notificationsApi.util.selectInvalidatedBy(getState(), [{ type: 'Notifications' }])

        const patchResults = allQueries.map(({ originalArgs }) =>
          dispatch(
            notificationsApi.util.updateQueryData('getNotifications', originalArgs, (draft) => {
              draft.items = draft.items.map((item) => (ids.includes(item.id) ? { ...item, isRead: true } : item))
              draft.notReadCount = Math.max(draft.notReadCount - ids.length, 0)
            })
          )
        )

        try {
          await queryFulfilled
        } catch {
          patchResults.forEach((patch) => patch.undo())
        }
      },
    }),
    deleteNotification: builder.mutation<void, number>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
        const allQueries = notificationsApi.util.selectInvalidatedBy(getState(), [{ type: 'Notifications' }])

        const patchResults = allQueries.map(({ originalArgs }) =>
          dispatch(
            notificationsApi.util.updateQueryData('getNotifications', originalArgs, (draft) => {
              draft.items = draft.items.filter((item) => item.id !== id)
              draft.totalCount -= 1
            })
          )
        )
        try {
          await queryFulfilled
        } catch {
          patchResults.forEach((patch) => patch.undo())
        }
      },
    }),
  }),
})

export const {
  useGetNotificationsQuery,
  useLazyGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useDeleteNotificationMutation,
} = notificationsApi
