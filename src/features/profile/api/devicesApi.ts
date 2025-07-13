import { joyfyApi } from '@/shared/api/joyfyApi'
import { UserSession } from '@/features/profile/api/devicesApi.types'

export const devicesApi = joyfyApi.injectEndpoints({
  endpoints: (builder) => ({
    getSessions: builder.query<UserSession, undefined>({
      query: () => ({
        url: '/sessions',
      }),
      providesTags: ['Devices'],
    }),
  }),
  overrideExisting: true,
})

export const {} = devicesApi
