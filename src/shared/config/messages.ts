export const AUTH_MESSAGES = {
  AUTH_SUCCESS: 'Successfully authenticated',
  SESSION_RESTORED: 'Session restored',
  LOGOUT_SUCCESS: 'You have been logged out',
  LOGOUT_ERROR: 'JWT accessToken is missing, expired or incorrect',
  queryErrors: {
    email_exists: 'This email is already registered with a different method. Please use your original login method.',
    account_not_found: 'Account not found. Please register first.',
    unauthorized: 'Authentication failed. Please try again.',
    unknown: 'Authentication error. Please try again later.',
  },
}
