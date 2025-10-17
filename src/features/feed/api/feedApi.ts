import { joyfyApi } from '@/shared/api/joyfyApi'
import { FeedQueryParams, FeedResponse } from './feedApi.types'

export const feedApi = joyfyApi.injectEndpoints({
  endpoints: (builder) => ({
    getFeedPosts: builder.query<FeedResponse, FeedQueryParams>({
      query: ({ endCursorPostId, pageSize = 8 }) => ({
        url: `/home/publications-followers`,
        params: { endCursorPostId, pageSize },
      }),

      serializeQueryArgs: ({ endpointName }) => endpointName,

      merge: (currentCache, newItems) => {
        const existingIds = new Set(currentCache.items.map((post) => post.id))
        const newUniqueItems = newItems.items.filter((post) => !existingIds.has(post.id))
        return {
          ...newItems,
          items: [...currentCache.items, ...newUniqueItems],
        }
      },
      providesTags: ['Feed'],
      keepUnusedDataFor: 300,
    }),
  }),
})

export const { useGetFeedPostsQuery, useLazyGetFeedPostsQuery } = feedApi
