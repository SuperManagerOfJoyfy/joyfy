import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { NotificationsResponse } from './notificationsApi.types'
import LocalStorage from '@/shared/utils/localStorage/localStorage'

export const notificationsApi = createApi({
  reducerPath: 'notificationsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = LocalStorage.getToken()
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Notification'],
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
        const params = new URLSearchParams()
        if (isRead !== undefined) params.append('isRead', isRead.toString())
        if (pageSize) params.append('pageSize', pageSize.toString())
        if (sortBy) params.append('sortBy', sortBy)
        if (sortDirection) params.append('sortDirection', sortDirection)
        if (cursor) params.append('cursor', cursor.toString())

        return `notifications?${params.toString()}`
      },
      providesTags: ['Notification'],
    }),

    markNotificationsAsRead: builder.mutation<void, { ids: number[] }>({
      query: (body) => ({
        url: 'notifications/mark-as-read',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Notification'],
    }),

    deleteNotification: builder.mutation<void, number>({
      query: (id) => ({
        url: `notifications/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notification'],
    }),
  }),
})

export const {
  useGetNotificationsQuery,
  useDeleteNotificationMutation,
  useLazyGetNotificationsQuery,
  useMarkNotificationsAsReadMutation,
} = notificationsApi
