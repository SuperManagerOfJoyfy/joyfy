import {
  CreatePostRequest,
  GetPostsResponse,
  PostsQueryParams,
  UploadImageResponse,
} from '@/features/post/api/postsApi.types'
import { joyfyApi } from '@/shared/api/joyfyApi'
import { Post } from '../types/types'

export const postsApi = joyfyApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getPosts: builder.query<GetPostsResponse, PostsQueryParams>({
      query: ({ userId, endCursorPostId, pageSize = 8, ...params }) => ({
        url: endCursorPostId ? `public-posts/user/${userId}/${endCursorPostId}` : `public-posts/user/${userId}`,
        method: 'GET',
        params: {
          pageSize,
          ...params,
        },
      }),
      serializeQueryArgs: ({ queryArgs }) => queryArgs.userId,

      merge: (currentCache, newItems, { arg }) => {
        if (!arg.endCursorPostId) {
          return newItems
        }
        return {
          items: [
            ...currentCache.items,
            ...newItems.items.filter((post) => currentCache.items.every((p) => p.id !== post.id)),
          ],
          totalCount: newItems.totalCount,
          pageSize: newItems.pageSize,
          totalUsers: newItems.totalUsers,
        }
      },
      forceRefetch: ({ currentArg, previousArg }) => {
        return currentArg?.endCursorPostId !== previousArg?.endCursorPostId
      },
      providesTags: ['Posts'],
    }),

    getPostById: builder.query<Post, number>({
      query: (postId) => ({
        url: `posts/id/${postId}`,
        method: 'GET',
      }),
      providesTags: (result, error, postId) => [{ type: 'Post', id: postId }],
    }),
    uploadImage: builder.mutation<UploadImageResponse, FormData>({
      query: (formData: FormData) => ({
        url: '/posts/image',
        method: 'POST',
        body: formData,
      }),
    }),

    deleteUploadedImage: builder.mutation<void, string>({
      query: (uploadId) => ({
        url: `/posts/image/${uploadId}`,
        method: 'DELETE',
      }),
    }),

    createPost: builder.mutation<Post, CreatePostRequest>({
      query: (payload) => ({
        url: '/posts',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Posts', 'Profile'],
    }),

    deletePost: builder.mutation<void, { postId: number; userId: number }>({
      query: ({ postId }) => ({
        url: `posts/${postId}`,
        method: 'DELETE',
      }),
      async onQueryStarted({ postId, userId }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          dispatch(
            postsApi.util.updateQueryData('getPosts', { userId }, (draft) => {
              draft.items = draft.items.filter((post) => post.id !== postId)
            })
          )
        } catch (error) {
          console.error('Error during deleting post:', error)
        }
      },
    }),

    editPost: builder.mutation<Post, { postId: number; description: string }>({
      query: ({ postId, description }) => {
        return { url: `posts/${postId}`, method: 'PUT', body: { description } }
      },
      invalidatesTags: (result, error, { postId }) => [{ type: 'Post', id: postId }],
    }),
  }),
})

export const {
  useGetPostsQuery,
  useGetPostByIdQuery,
  useUploadImageMutation,
  useDeleteUploadedImageMutation,
  useCreatePostMutation,
  useDeletePostMutation,
  useEditPostMutation,
} = postsApi
