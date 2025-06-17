import { joyfyApi } from '@/shared/api/joyfyApi'
import { PublicUserProfile, UploadedAvatarResponse, UserProfile } from './profileApi.types'

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
    uploadProfileAvatar: builder.mutation<UploadedAvatarResponse, FormData>({
      query: (avatarData: FormData) => ({
        method: 'POST',
        url: 'users/profile/avatar',
        body: avatarData,
      }),
      invalidatesTags: ['Profile'],
    }),
    deleteProfileAvatar: builder.mutation<void, void>({
      query: () => ({
        method: 'DELETE',
        url: 'users/profile/avatar',
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
  useUploadProfileAvatarMutation,
  useDeleteProfileAvatarMutation,
} = profileApi
