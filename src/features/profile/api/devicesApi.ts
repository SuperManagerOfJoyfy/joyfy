import { joyfyApi } from '@/shared/api/joyfyApi'
import { UserSession } from '@/features/profile/api/devicesApi.types'

export const devicesApi = joyfyApi.injectEndpoints({
  endpoints: (builder) => ({
    getSessions: builder.query<UserSession, void>({
      query: () => ({
        url: '/sessions',
      }),
      providesTags: ['Devices'],
    }),
    logOut: builder.mutation<void, number>({
      query: (deviceId: number) => ({
        method: 'DELETE',
        url: `/sessions/${deviceId}`,
      }),
      invalidatesTags: ['Devices'],
    }),
    terminateAllOtherSessions: builder.mutation<void, void>({
      query: () => ({
        method: 'DELETE',
        url: '/sessions/terminate-all',
      }),
      invalidatesTags: ['Devices'],
    }),
  }),

  overrideExisting: true,
})

export const { useGetSessionsQuery, useLogOutMutation, useTerminateAllOtherSessionsMutation } = devicesApi
