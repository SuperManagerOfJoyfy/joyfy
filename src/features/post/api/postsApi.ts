import {
  CreatePostRequest,
  GetPostsResponse,
  PostsQueryParams,
  UploadImageResponse,
} from '@/features/post/api/postsApi.types'
import { joyfyApi } from '@/shared/api/joyfyApi'
import { Post, PostLikes } from '../types/postTypes'
import { number } from 'zod'

export const postsApi = joyfyApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getPosts: builder.query<GetPostsResponse, PostsQueryParams>({
      query: ({ userId, endCursorPostId, pageSize = 8, ...params }) => ({
        url: `public-posts/user/${userId}/${endCursorPostId}`,
        method: 'GET',
        params: {
          pageSize,
          ...params,
        },
      }),
      // Ключ кэширования только по userId
      serializeQueryArgs: ({ queryArgs }) => queryArgs.userId,
      merge: (currentCache, newItems, { arg }) => {
        return {
          ...newItems,
          items: [...currentCache.items, ...newItems.items],
        }
      },
      providesTags: ['Posts'],
      keepUnusedDataFor: 600,
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
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data: newPost } = await queryFulfilled
          const userId = newPost.ownerId

          dispatch(
            postsApi.util.updateQueryData('getPosts', { userId }, (draft) => {
              draft.items.unshift(newPost)
              draft.totalCount += 1
            })
          )

          dispatch(joyfyApi.util.invalidateTags(['Profile']))
        } catch (error) {
          console.error('Error during post creation:', error)
        }
      },
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

    getPostLikes: builder.query<PostLikes, number>({
      query: (postId) => ({
        url: `posts/${postId}/likes`,
        method: 'GET',
      }),
      providesTags: (result, error, postId) => [{ type: 'Post', id: postId }],
    }),
  }),
})

export const {
  useLazyGetPostsQuery,
  useGetPostByIdQuery,
  useUploadImageMutation,
  useDeleteUploadedImageMutation,
  useCreatePostMutation,
  useDeletePostMutation,
  useEditPostMutation,
  useGetPostLikesQuery,
} = postsApi
