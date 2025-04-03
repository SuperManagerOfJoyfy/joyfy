const ACCESS_TOKEN_KEY = 'joyfy_access_token'

export const saveAccessToken = (token: string): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export const clearAccessToken = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
}

export const hasAccessToken = (): boolean => {
  return !!getAccessToken()
}
