import { fetchBaseQuery } from '@reduxjs/toolkit/query'
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query'
import { Mutex } from 'async-mutex'

const mutex = new Mutex()

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://gateway.joyfy.online/api/v1',
  prepareHeaders(headers) {
    // headers.set('Access-Control-Allow-Credentials', 'true')

    return headers
  },
  credentials: 'include',
})

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock()

  let result = await baseQuery(args, api, extraOptions)

  if (result.error?.status === 401) {

    if (!mutex.isLocked()) {
      const release = await mutex.acquire()
      try {

        const refreshResult = await baseQuery(
          { url: '/auth/refresh-token', method: 'POST' },
          api,
          extraOptions
        )

        if (!refreshResult.error) {
          result = await baseQuery(args, api, extraOptions)
        } else {
          console.log('Refresh token failed:', refreshResult.error)
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