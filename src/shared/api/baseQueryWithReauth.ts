import { BaseQueryFn, FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query'
import { Mutex } from 'async-mutex'
import { PATH } from '../config/routes'
import { handleErrors } from '@/shared/utils/handleErrors/handleErrors'
import LocalStorage from '../utils/localStorage/localStorage'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react'

const mutex = new Mutex()
let lastRefreshResult: boolean | null = null
let lastRefreshAttempt = 0

const createBaseQuery = () =>
  fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = LocalStorage.getToken()
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    },
  })

export const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  return createBaseQuery()(args, api, extraOptions)
}

export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  await mutex.waitForUnlock()

  const isAuthMeRequest = typeof args !== 'string' && args.url === '/auth/me'
  const isRefreshEndpoint = typeof args !== 'string' && args.url === '/auth/update-tokens' && args.method === 'POST'
  const isLoginEndpoint = typeof args !== 'string' && args.url === '/auth/login' && args.method === 'POST'

  const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''

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
    handleErrors(api, result)
    return result
  }

  let result = await baseQuery(args, api, extraOptions)

  if (result.error?.status === 401 && !isRefreshEndpoint) {
    const currentTime = Date.now()
    const refreshCooldown = 3000

    if (lastRefreshResult === false && currentTime - lastRefreshAttempt < refreshCooldown) {
      console.log('Skipping refresh - recent failure')
      return result
    }

    if (!mutex.isLocked()) {
      const release = await mutex.acquire()

      try {
        lastRefreshAttempt = Date.now()
        lastRefreshResult = null

        console.log('Attempting to refresh token')

        const refreshResult = await baseQuery({ url: '/auth/update-tokens', method: 'POST' }, api, extraOptions)

        if (!refreshResult.error) {
          console.log('Token refresh successful')
          lastRefreshResult = true

          const data = refreshResult.data as { accessToken: string }
          LocalStorage.setToken(data.accessToken)

          result = await baseQuery(args, api, extraOptions)
        } else {
          console.log('Token refresh failed:', refreshResult.error)
          lastRefreshResult = false
          if (!(isAuthMeRequest && isPublicPage)) {
            await baseQuery({ url: '/auth/logout', method: 'POST' }, api, extraOptions)
            LocalStorage.removeToken()
            localStorage.removeItem('userEmail')
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

  handleErrors(api, result)

  return result
}
