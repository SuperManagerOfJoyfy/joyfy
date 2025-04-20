import { joyfyApi } from '@/shared/api/joyfyApi';
import { CreatePostRequest, PostResponse } from '../types/types';

export const postsApi = joyfyApi.injectEndpoints({
    endpoints: (builder) => ({
      createPost: builder.mutation<PostResponse, CreatePostRequest>({
        query: (body) => ({
          url: '/post',
          method: 'POST',
          body,
        }),
      }),
    }),
  });
  
  export const { useCreatePostMutation } = postsApi;