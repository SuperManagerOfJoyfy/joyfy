import { joyfyApi } from '@/shared/api/joyfyApi'
import {
  PublicUserProfile,
  UploadedAvatarResponse,
  UserFollowers,
  UserProfile,
  UserProfileWithFollowers,
} from './profileApi.types'
import { feedApi } from '@/features/feed/api/feedApi'

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

    getUserProfileWithFollowers: builder.query<UserProfileWithFollowers, string>({
      query: (userName) => ({
        url: `/users/${userName}`,
        method: 'GET',
      }),
      providesTags: ['Profile'],
    }),

    getUserFollowing: builder.query<UserFollowers, string>({
      query: (userName) => ({
        url: `/users/${userName}/following`,
        method: 'GET',
      }),
      providesTags: ['Following'],
    }),

    getUserFollowers: builder.query<UserFollowers, string>({
      query: (userName) => ({
        url: `/users/${userName}/followers`,
        method: 'GET',
      }),
      providesTags: ['Following'],
    }),

    followUserById: builder.mutation<void, number>({
      query: (userId) => ({
        method: 'POST',
        url: 'users/following',
        body: {
          selectedUserId: userId,
        },
      }),
      invalidatesTags: ['Profile', 'Following'],
      async onQueryStarted(userId, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          // Small delay so the user sees the button text change
          await new Promise((r) => setTimeout(r, 400))
          // Then refresh the feed
          dispatch(feedApi.util.invalidateTags(['Feed']))
        } catch {}
      },
    }),

    unfollowUserById: builder.mutation<void, number>({
      query: (userId) => ({
        method: 'DELETE',
        url: `users/follower/${userId}`,
      }),
      invalidatesTags: ['Profile', 'Following'],
      async onQueryStarted(userId, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          // Let the menu show "Unfollowing" -> "Unfollowed" briefly
          await new Promise((r) => setTimeout(r, 400))

          // Now remove posts by that user from the feed cache (all pages in one cache)
          dispatch(
            feedApi.util.updateQueryData('getFeedPosts', {}, (draft) => {
              draft.items = draft.items.filter((p) => p.ownerId !== userId)
              draft.totalCount = Math.max(0, draft.items.length)
            })
          )
        } catch {
          // no-op (no optimistic change to undo)
        }
      },
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
  useGetUserProfileWithFollowersQuery,
  useFollowUserByIdMutation,
  useUnfollowUserByIdMutation,
  useGetUserFollowingQuery,
  useGetUserFollowersQuery,
} = profileApi
