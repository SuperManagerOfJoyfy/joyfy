import { joyfyApi } from '@/shared/api/joyfyApi'

import { Answer, Comment, CommentResponse, AnswerResponse, LikeStatus } from './commentsApi.types'
import { PAGINATION_DEFAULTS, applyLikeChange } from '../utils'

export const commentsApi = joyfyApi.injectEndpoints({
  endpoints: (builder) => ({
    createComment: builder.mutation<Comment, { postId: number; content: string }>({
      query: ({ postId, content }) => ({
        url: `posts/${postId}/comments`,
        method: 'POST',
        body: { content },
      }),
      invalidatesTags: ['Comment'],
      async onQueryStarted({ postId }, { dispatch, queryFulfilled, getState }) {
        try {
          const { data: newComment } = await queryFulfilled

          const state = getState()
          const cachedArgs = commentsApi.util.selectCachedArgsForQuery(state, 'getComments')
          const matchingArgs = cachedArgs.find((args) => args.postId === postId)

          if (matchingArgs) {
            dispatch(
              commentsApi.util.updateQueryData('getComments', matchingArgs, (draft) => {
                draft.items.unshift(newComment)
                draft.totalCount += 1
              })
            )
          } else {
            dispatch(commentsApi.endpoints.getComments.initiate({ postId }))
          }
        } catch {}
      },
    }),

    createCommentAnswer: builder.mutation<Answer, { postId: number; commentId: number; content: string }>({
      query: ({ postId, commentId, content }) => ({
        url: `posts/${postId}/comments/${commentId}/answers`,
        method: 'POST',
        body: { content },
      }),
      invalidatesTags: ['Comment'],
      async onQueryStarted({ postId, commentId }, { dispatch, queryFulfilled }) {
        try {
          const { data: newAnswer } = await queryFulfilled

          dispatch(
            commentsApi.util.updateQueryData('getCommentAnswers', { postId, commentId }, (draft) => {
              draft.items.unshift(newAnswer)
              draft.totalCount += 1
            })
          )

          dispatch(
            commentsApi.util.updateQueryData('getComments', { postId }, (draft) => {
              const comment = draft.items.find((c) => c.id === commentId)
              if (comment) comment.answerCount += 1
            })
          )
        } catch {}
      },
    }),

    getComments: builder.query<
      CommentResponse,
      { postId: number; pageSize?: number; pageNumber?: number; sortBy?: string; sortDirection?: 'asc' | 'desc' }
    >({
      query: ({
        postId,
        pageSize = PAGINATION_DEFAULTS.PAGE_SIZE,
        pageNumber = PAGINATION_DEFAULTS.PAGE_NUMBER,
        sortBy,
        sortDirection = PAGINATION_DEFAULTS.SORT_DIRECTION,
      }) => ({
        url: `posts/${postId}/comments`,
        params: { pageSize, pageNumber, sortBy, sortDirection },
      }),
      providesTags: (result) =>
        result?.items ? result.items.map(({ id }) => ({ type: 'Comment' as const, id })) : ['Comment'],
    }),

    getCommentAnswers: builder.query<
      AnswerResponse,
      {
        postId: number
        commentId: number
        pageSize?: number
        pageNumber?: number
        sortBy?: string
        sortDirection?: 'asc' | 'desc'
      }
    >({
      query: ({
        postId,
        commentId,
        pageSize = PAGINATION_DEFAULTS.PAGE_SIZE,
        pageNumber = PAGINATION_DEFAULTS.PAGE_NUMBER,
        sortBy,
        sortDirection = PAGINATION_DEFAULTS.SORT_DIRECTION,
      }) => ({
        url: `posts/${postId}/comments/${commentId}/answers`,
        params: { pageSize, pageNumber, sortBy, sortDirection },
      }),
      providesTags: (result) =>
        result?.items ? result.items.map(({ id }) => ({ type: 'Comment' as const, id })) : ['Comment'],
    }),

    updateCommentLikeStatus: builder.mutation<void, { postId: number; commentId: number; likeStatus: LikeStatus }>({
      query: ({ postId, commentId, likeStatus }) => ({
        url: `posts/${postId}/comments/${commentId}/like-status`,
        method: 'PUT',
        body: { likeStatus },
      }),
      async onQueryStarted({ postId, commentId, likeStatus }, { dispatch, queryFulfilled, getState }) {
        const patches: { undo: () => void }[] = []
        const state = getState()
        const queries = commentsApi.util.selectCachedArgsForQuery(state, 'getComments')

        queries.forEach((queryArgs) => {
          if (queryArgs.postId === postId) {
            const patchAction = commentsApi.util.updateQueryData('getComments', queryArgs, (draft) => {
              const comment = draft.items.find((c) => c.id === commentId)
              if (comment) applyLikeChange(comment, likeStatus)
            })
            const patch = dispatch(patchAction)
            patches.push(patch)
          }
        })

        try {
          await queryFulfilled
        } catch {
          patches.forEach((patch) => patch.undo?.())
        }
      },
    }),

    updateAnswerLikeStatus: builder.mutation<
      void,
      { postId: number; commentId: number; answerId: number; likeStatus: LikeStatus }
    >({
      query: ({ postId, commentId, answerId, likeStatus }) => ({
        url: `posts/${postId}/comments/${commentId}/answers/${answerId}/like-status`,
        method: 'PUT',
        body: { likeStatus },
      }),
      async onQueryStarted({ postId, commentId, answerId, likeStatus }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          commentsApi.util.updateQueryData('getCommentAnswers', { postId, commentId }, (draft) => {
            const answer = draft.items.find((a) => a.id === answerId)
            if (answer) applyLikeChange(answer, likeStatus)
          })
        )

        try {
          await queryFulfilled
        } catch {
          patch.undo?.()
        }
      },
    }),
  }),
})

export const {
  useCreateCommentMutation,
  useCreateCommentAnswerMutation,
  useGetCommentsQuery,
  useGetCommentAnswersQuery,
  useUpdateCommentLikeStatusMutation,
  useUpdateAnswerLikeStatusMutation,
} = commentsApi
