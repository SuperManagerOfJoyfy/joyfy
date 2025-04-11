import { fetchBaseQuery } from '@reduxjs/toolkit/query'
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query'
import { Mutex } from 'async-mutex'
import { PATH } from '../config/routes'

const mutex = new Mutex()
let lastRefreshResult: boolean | null = null
let lastRefreshAttempt = 0

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  prepareHeaders(headers) {
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

  const isAuthMeRequest = typeof args !== 'string' && args.url === '/auth/me'
  const isRefreshEndpoint =
    typeof args !== 'string' &&
    args.url === '/auth/refresh-token' &&
    args.method === 'POST'
  const isLoginEndpoint =
    typeof args !== 'string' &&
    args.url === '/auth/login' &&
    args.method === 'POST'

  const currentPath =
    typeof window !== 'undefined' ? window.location.pathname : ''

  const isPublicPage = [
    PATH.ROOT,
    PATH.AUTH.REGISTRATION,
    PATH.AUTH.LOGIN,
    PATH.AUTH.PRIVACY_POLICY,
    PATH.AUTH.TERMS_OF_SERVICE,
    PATH.AUTH.EMAIL_CONFIRMED,
  ].includes(currentPath)

  if (isLoginEndpoint) {
    const result = await baseQuery(args, api, extraOptions)
    return result
  }

  let result = await baseQuery(args, api, extraOptions)

  if (isAuthMeRequest && !result.error) {
    return result
  }

  if (isAuthMeRequest && isPublicPage && result.error?.status === 401) {
    return { data: null, meta: {} }
  }

  if (result.error?.status === 401 && !isRefreshEndpoint) {
    const currentTime = Date.now()
    const refreshCooldown = 3000

    if (
      lastRefreshResult === false &&
      currentTime - lastRefreshAttempt < refreshCooldown
    ) {
      console.log('Skipping refresh - recent failure')
      return result
    }

    if (!mutex.isLocked()) {
      const release = await mutex.acquire()

      try {
        lastRefreshAttempt = Date.now()
        lastRefreshResult = null

        console.log('Attempting to refresh token')

        const refreshResult = await baseQuery(
          { url: '/auth/refresh-token', method: 'POST' },
          api,
          extraOptions
        )

        if (!refreshResult.error) {
          console.log('Token refresh successful')
          lastRefreshResult = true

          result = await baseQuery(args, api, extraOptions)
        } else {
          console.log('Token refresh failed:', refreshResult.error)
          lastRefreshResult = false

          if (!(isAuthMeRequest && isPublicPage)) {
            api.dispatch({ type: 'auth/logoutUser' })
          }
        }
      } finally {
        release()
      }
    } else {
      console.log('Waiting for token refresh to complete')
      await mutex.waitForUnlock()

      if (lastRefreshResult === true) {
        console.log('Using recently refreshed token')
        result = await baseQuery(args, api, extraOptions)
      }
    }
  }

  return result
}
