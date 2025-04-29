import { GetAllPostsResponse, UploadImageResponse, CreatePostRequest } from '@/features/post/api/postsApi.types'
import { joyfyApi } from '@/shared/api/joyfyApi'
import { PostItem } from '../types/types'

export const postsApi = joyfyApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPosts: builder.query<GetAllPostsResponse, { userName: string }>({
      query: ({ userName }) => ({
        url: `/posts/${userName}`,
        method: 'GET',
      }),
      providesTags: ['Posts'],
    }),
    uploadImage: builder.mutation<UploadImageResponse, FormData>({
      query: (formData) => ({
        url: '/posts/image',
        method: 'POST',
        body: formData,
      }),
      //   providesTags: ['Posts'],
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
  }),
})

export const { useGetAllPostsQuery, useUploadImageMutation, useDeleteUploadedImageMutation, useCreatePostMutation } =
  postsApi
