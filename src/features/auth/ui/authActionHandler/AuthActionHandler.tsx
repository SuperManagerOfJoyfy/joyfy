import { redirect } from 'next/navigation'
import { EmailConfirmationSuccess } from '@/features/auth/ui/emailConfirmation/EmailConfirmationSuccess'
import { LinkExpired } from '@/features/auth/ui/emailConfirmation/LinkExpired'

type Props = {
  code: string
  email?: string
  locale: string
}

type ApiError = {
  statusCode: number
  messages: { message: string; field: string }[]
  error: string
}

export type ReasonType = 'REGISTRATION' | 'RECOVERY' | undefined

export const AuthActionHandler = async ({ code, email, locale }: Props) => {
  const cleanCode = code.trim()
  let reason: ReasonType = undefined

  try {
    const confirmRegistrationResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/registration-confirmation`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmationCode: cleanCode }),
      }
    )

    if (confirmRegistrationResponse.status === 204) {
      return <EmailConfirmationSuccess />
    }

    if (confirmRegistrationResponse.status === 400) {
      const data = (await confirmRegistrationResponse.json()) as ApiError
      if (data.messages?.[0]?.message === 'Confirmation code is invalid') {
        reason = 'REGISTRATION'
      }

      const confirmRecoveryResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/check-recovery-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recoveryCode: cleanCode }),
      })

      if (confirmRecoveryResponse.status === 200) {
        redirect(`/${locale}/auth/new-password?code=${cleanCode}&email=${email}`)
      }

      if (confirmRecoveryResponse.status === 400) {
        const recoveryData = (await confirmRecoveryResponse.json()) as ApiError
        if (recoveryData.messages?.[0]?.message === 'Code is not valid') {
          reason = 'RECOVERY'
        }
      }
    }

    return <LinkExpired reason={reason} locale={locale} />
  } catch (error) {
    if ((error as any).digest?.startsWith('NEXT_REDIRECT')) {
      throw error
    }
    console.error('Auth verification error:', error)
    return <LinkExpired reason={reason} locale={locale} />
  }
}
