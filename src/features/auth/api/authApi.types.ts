export type MeResponse = {
  userId: string
  username: string
  email: string
  deviceId: string
}

export type LoginRequest = {
  email: string
  password: string
}

export type LoginResponse = {
  success: boolean
  message: string
}

export type RegisterRequest = {
  username: string
  email: string
  password: string
  passwordConfirmation: string
  agreeToTerms: boolean
}

export type ConfirmEmailRequest = {
  code: string
}

export type EmailInputDto = {
  email: string
}

export type RecoverPasswordRequest = {
  email: string
  recaptcha: string
}

export type NewPasswordRequest = {
  recoveryCode: string
  newPassword: string
  recaptcha: string
}

export type RefreshTokenResponse = {
  accessToken: string
}
