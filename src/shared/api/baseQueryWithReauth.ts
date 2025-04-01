// export const baseApi = createApi({
//   baseQuery: async (args, api, extraOptions) => {
//     const result = await fetchBaseQuery({
//       baseUrl: process.env.REACT_APP_BASE_URL,
//       credentials: "include",
//       prepareHeaders: (headers) => {
//         headers.set("API-KEY", `${process.env.REACT_APP_API_KEY}`)
//         headers.set("Authorization", `Bearer ${process.env.REACT_APP_AUTH_TOKEN2}`)
//       },
//     })(args, api, extraOptions)
//
//     handleError(api, result)
//
//     return result
//   },
//   endpoints: () => ({}),
//   tagTypes: [],
//   refetchOnFocus: true,
//   refetchOnReconnect: true
// })

// import { createApi } from '@reduxjs/toolkit/query/react'
//
// import { baseQueryWithReauth } from './baseQueryWithReauth'
//
// export const baseApi = createApi({
//   baseQuery: baseQueryWithReauth,
//   endpoints: () => ({}),
//   reducerPath: 'baseApi',
//   tagTypes: ['Decks', 'CardLearn', 'Me', 'Cards', 'MinMaxCards', 'Deck'],
// })

import { fetchBaseQuery } from '@reduxjs/toolkit/query'
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query'
import { Mutex } from 'async-mutex'
import Router from 'next/router'

const mutex = new Mutex()

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token')

      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
    }
    return headers
  },
})

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock()

  let result = await baseQuery(args, api, extraOptions)
  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire()
      try {
        const refreshResult = (await baseQuery(
          { url: '/auth/refresh-token', method: 'POST' },
          api,
          extraOptions
        )) as any
        // убрать as any

        if (refreshResult.data) {
          // ???
          localStorage.setItem('access_token', refreshResult.data.accessToken)

          result = await baseQuery(args, api, extraOptions)
        } else {
          await Router.push('/auth/login')
        }
      } finally {
        release()
      }
    } else {
      await mutex.waitForUnlock()
      result = await baseQuery(args, api, extraOptions)
    }
  }
  return result
}
