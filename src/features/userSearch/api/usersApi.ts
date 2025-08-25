import { GetUsersResponse, UsersQueryParams } from '@/features/userSearch/api/usersApi.types'
import { joyfyApi } from '@/shared/api/joyfyApi'

export const usersApi = joyfyApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    searchUserByName: builder.query<GetUsersResponse, UsersQueryParams>({
      query: ({ search, pageSize = 12, cursor = 0, ...params }) => ({
        url: 'users?',
        method: 'GET',
        params: {
          search,
          pageSize,
          cursor,
          ...params,
        },
      }),
      serializeQueryArgs: ({ queryArgs }) => queryArgs.search,
      merge: (currentCache, newItems, { arg }) => {
        if (arg.cursor === 0) {
          return newItems
        }

        return {
          ...newItems,
          items: [
            ...currentCache.items,
            ...newItems.items.filter((u) => !currentCache.items.some((c) => c.id === u.id)),
          ],
        }
      },

      keepUnusedDataFor: 600,
    }),
  }),
})

export const { useLazySearchUserByNameQuery, useSearchUserByNameQuery } = usersApi
