export type MeResponse = {
  userId: string
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
  passwordConfirmation: string
  agreeToTerms: boolean
}

export type ConfirmEmailRequest = {
  confirmationCode: string
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

export type SignUpArgs = {
  username: string
  email: string
  password: string
  confirmEmail: string
  agreeToTerms: boolean
}

