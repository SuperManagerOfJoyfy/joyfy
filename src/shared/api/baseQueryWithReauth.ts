import { BaseQueryFn, FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { Mutex } from 'async-mutex'
import { PATH } from '../config/routes'
import { handleErrors } from '@/shared/utils/handleErrors/handleErrors'
import LocalStorage from '../utils/localStorage/localStorage'
import { setToken } from '@/features/auth/model/authSlice'

/** —— i18n helpers —— */
const LOCALES = ['en', 'ru'] as const

function getLocaleFromPath(pathname: string): string {
  if (!pathname.startsWith('/')) return 'en'
  const seg = pathname.split('/')[1]
  return (LOCALES as readonly string[]).includes(seg) ? seg : 'en'
}

function stripLocale(pathname: string): string {
  if (!pathname.startsWith('/')) return pathname
  const seg = pathname.split('/')[1]
  return (LOCALES as readonly string[]).includes(seg) ? pathname.slice(seg.length + 1) || '/' : pathname
}

function withLocalePath(path: string): string {
  if (typeof window === 'undefined') return path
  const locale = getLocaleFromPath(window.location.pathname)
  return `/${locale}${path}`
}

/** —— base queries —— */
const mutex = new Mutex()
let lastRefreshResult: boolean | null = null
let lastRefreshAttempt = 0

const createBaseQuery = () =>
  fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = LocalStorage.getToken()
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  })

export const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => createBaseQuery()(args, api, extraOptions)

/** —— reauth wrapper —— */
export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  await mutex.waitForUnlock()

  // API
  const isAuthMeRequest = typeof args !== 'string' && args.url === '/auth/me'
  const isRefreshEndpoint = typeof args !== 'string' && args.url === '/auth/update-tokens' && args.method === 'POST'
  const isLoginEndpoint = typeof args !== 'string' && args.url === '/auth/login' && args.method === 'POST'
  const isGoogleLoginEndpoint = typeof args !== 'string' && args.url === '/auth/google/login' && args.method === 'POST'

  const rawPath = typeof window !== 'undefined' ? window.location.pathname : ''
  const pathNoLocale = stripLocale(rawPath)

  const PUBLIC_PATHS = new Set<string>([
    PATH.ROOT, // '/'
    PATH.AUTH.LOGIN, // '/auth/login'
    PATH.AUTH.REGISTRATION, // '/auth/registration'
    PATH.AUTH.PRIVACY_POLICY, // '/auth/privacy-policy'
    PATH.AUTH.TERMS_OF_SERVICE, // '/auth/terms-of-service'
    PATH.AUTH.EMAIL_CONFIRMED, // '/auth/email-confirmed'
    PATH.AUTH.GOOGLE, // '/auth/google'
    PATH.AUTH.GITHUB, // '/auth/github'
  ])

  const isPublicPage = PUBLIC_PATHS.has(pathNoLocale) || pathNoLocale.startsWith(PATH.USER.PROFILE)

  if (isLoginEndpoint || isGoogleLoginEndpoint) {
    const res = await baseQuery(args, api, extraOptions)
    handleErrors(api, res)
    return res
  }

  let result = await baseQuery(args, api, extraOptions)

  if (result.error?.status === 401 && !isRefreshEndpoint) {
    if (isAuthMeRequest && isPublicPage) {
      handleErrors(api, result)
      return result
    }

    const now = Date.now()
    const cooldownMs = 3000
    if (lastRefreshResult === false && now - lastRefreshAttempt < cooldownMs) {
      return result
    }

    if (!mutex.isLocked()) {
      const release = await mutex.acquire()
      try {
        lastRefreshAttempt = Date.now()
        lastRefreshResult = null

        const refresh = await baseQuery({ url: '/auth/update-tokens', method: 'POST' }, api, extraOptions)

        if (!refresh.error) {
          lastRefreshResult = true
          const data = refresh.data as { accessToken: string }
          LocalStorage.setToken(data.accessToken)
          api.dispatch(setToken(data.accessToken))
          result = await baseQuery(args, api, extraOptions)
        } else {
          lastRefreshResult = false
          LocalStorage.removeToken()
          if (typeof window !== 'undefined') {
            localStorage.removeItem('userEmail')
            const target = withLocalePath(PATH.AUTH.LOGIN)
            if (rawPath !== target) {
              window.location.href = target
            } else {
            }
          }
        }
      } finally {
        release()
      }
    } else {
      await mutex.waitForUnlock()
      if (lastRefreshResult === true) {
        result = await baseQuery(args, api, extraOptions)
      }
    }
  }

  handleErrors(api, result)
  return result
}
