import { joyfyApi } from '@/shared/api/joyfyApi'

import { Answer, Comment } from './commetsApi.types'

export const commentsApi = joyfyApi.injectEndpoints({
  endpoints: (builder) => ({
    createComment: builder.mutation<Comment, { postId: number; content: string }>({
      query: ({ postId, content }) => ({
        url: `posts/${postId}/comments`,
        method: 'POST',
        body: { content },
      }),
    }),

    createCommentAnswer: builder.mutation<Answer, { postId: number; commentId: number; content: string }>({
      query: ({ postId, commentId, content }) => ({
        url: `posts/${postId}/comments/${commentId}/answers`,
        method: 'POST',
        body: { content },
      }),
    }),
  }),
})

export const { useCreateCommentMutation, useCreateCommentAnswerMutation } = commentsApi
