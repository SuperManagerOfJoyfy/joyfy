import { joyfyApi } from '@/shared/api/joyfyApi'
import { UserProfile } from './profileApi.types'

export const profileApi = joyfyApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query<UserProfile, void>({
      query: () => ({
        url: '/users/profile',
        method: 'GET',
      }),
      providesTags: ['Profile'],
    }),
  }),
  overrideExisting: true,
})

export const { useGetUserProfileQuery, useLazyGetUserProfileQuery } = profileApi
