import {
  CreatePostRequest,
  GetAllPostsResponse,
  PostsQueryParams,
  UploadImageResponse,
} from '@/features/post/api/postsApi.types'
import { joyfyApi } from '@/shared/api/joyfyApi'
import { PostItem } from '../types/types'

export const postsApi = joyfyApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllPosts: builder.infiniteQuery<GetAllPostsResponse, PostsQueryParams, number>({
      query: ({ queryArg, pageParam }) => {
        const { userName, pageSize, sortBy, sortDirection } = queryArg
        return {
          url: `/posts/${userName}`,
          method: 'GET',
          params: {
            pageSize,
            sortBy,
            sortDirection,
            pageNumber: pageParam,
          },
        }
      },
      infiniteQueryOptions: {
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages, lastPageParam) => {
          if (lastPageParam >= lastPage.pagesCount) {
            return undefined
          }
          return lastPageParam + 1
        },
      },
      providesTags: (result) =>
        result
          ? [
              ...result.pages.flatMap((page) => page.items.map(({ id }) => ({ type: 'Posts' as const, id }))),
              { type: 'Posts' as const, id: 'LIST' },
            ]
          : [{ type: 'Posts' as const, id: 'LIST' }],
    }),

    getPostById: builder.query<PostItem, number>({
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

    createPost: builder.mutation<PostItem, CreatePostRequest>({
      query: (payload) => ({
        url: '/posts',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Posts'],
    }),

    deletePost: builder.mutation<void, { postId: number }>({
      query: ({ postId }) => ({
        url: `posts/${postId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Posts'],
    }),

    editPost: builder.mutation<PostItem, { postId: number; description: string }>({
      query: ({ postId, description }) => {
        return { url: `posts/${postId}`, method: 'PUT', body: { description } }
      },
      invalidatesTags: (result, error, { postId }) => [{ type: 'Post', id: postId }],
    }),
  }),
})

export const {
  useGetAllPostsInfiniteQuery,
  useGetPostByIdQuery,
  useUploadImageMutation,
  useDeleteUploadedImageMutation,
  useCreatePostMutation,
  useDeletePostMutation,
  useEditPostMutation,
} = postsApi
