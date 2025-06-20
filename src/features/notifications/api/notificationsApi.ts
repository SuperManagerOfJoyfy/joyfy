import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { NotificationsResponse } from './notificationsApi.types'

export const notificationsApi = createApi({
  reducerPath: 'notificationsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1/notifications',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth?.token
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
      query: ({ cursor, sortBy = 'notifyAt', isRead, pageSize = 10, sortDirection = 'desc' }) => {
        const params = new URLSearchParams()
        if (isRead !== undefined) params.append('isRead', isRead.toString())
        if (pageSize) params.append('pageSize', pageSize.toString())
        if (sortBy) params.append('sortBy', sortBy)
        if (sortDirection) params.append('sortDirection', sortDirection)

        const url = cursor ? `/${cursor}` : ''
        return `${url}?${params.toString()}`
      },
      providesTags: ['Notification'],
    }),

    deleteNotification: builder.mutation<void, number>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notification'],
    }),
  }),
})

export const { useGetNotificationsQuery, useDeleteNotificationMutation, useLazyGetNotificationsQuery } =
  notificationsApi
