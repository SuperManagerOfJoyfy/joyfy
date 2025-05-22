import { joyfyApi } from '@/shared/api/joyfyApi'
import { PublicUserProfile, UserProfile } from './profileApi.types'

export const profileApi = joyfyApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query<UserProfile, void>({
      query: () => ({
        url: '/users/profile',
        method: 'GET',
      }),
      providesTags: ['Profile'],
    }),
    getPublicUserProfile: builder.query<PublicUserProfile, string>({
      query: (profileId) => ({
        url: `public-user/profile/${profileId}`,
        method: 'GET',
      }),
      providesTags: (result, error, profileId) => [{ type: 'Profile', id: profileId }],
    }),
    updateUserProfile: builder.mutation<void, Partial<UserProfile>>({
      query: (profileData) => ({
        url: '/users/profile',
        method: 'PUT',
        body: profileData,
      }),
      invalidatesTags: ['Profile'],
    }),
  }),
  overrideExisting: true,
})

export const {
  useGetUserProfileQuery,
  useLazyGetUserProfileQuery,
  useGetPublicUserProfileQuery,
  useUpdateUserProfileMutation,
} = profileApi
