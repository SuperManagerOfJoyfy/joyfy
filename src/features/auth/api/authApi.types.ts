export type MeResponse = {
  userId: number
  userName: string
  email: string
  isBlocked: boolean
}

export type LoginRequest = {
  email: string
  password: string
}

export type LoginResponse = {
  accessToken: string
}

export type RegisterRequest = {
  userName: string
  email: string
  password: string
  passwordConfirmation?: string
  agreeToTerms?: boolean
  baseUrl: string
}

export type ConfirmEmailRequest = {
  confirmationCode: string
}

export type EmailInputDto = {
  email: string
  baseUrl?: string
}

export type RecoverPasswordRequest = {
  email: string
  recaptcha: string
  baseUrl: string
}

export type NewPasswordRequest = {
  recoveryCode: string
  newPassword: string
}

export type RefreshTokenResponse = {
  accessToken: string
}

export type SignUpArgs = {
  username: string
  email: string
  password: string
  confirmEmail: string
  agreeToTerms: boolean
}

export type GoogleLoginRequest = {
  redirectUrl: string
  code: string
}

export type GithubLoginRequest = {
  redirectUrl: string
}

export type OAuthLoginResponse = {
  accessToken: string
  email: string
}
