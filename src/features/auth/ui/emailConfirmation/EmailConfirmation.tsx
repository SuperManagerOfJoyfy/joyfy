import { EmailVerification } from '@/features/auth/ui/emailVerification'
import { Button } from '@/shared/ui'
import React from 'react'
import infoImg from '@/features/auth/assets/images/EmailVerification/confirm.png'
import Link from 'next/link'
import { PATH } from '@/shared/config/routes'
import { LinkExpired } from '@/features/auth/ui/emailConfirmation/LinkExpired'
import s from './EmailConfirmation.module.scss'

export const EmailConfirmation = async ({ code }: { code: string }) => {
  try {
    const confirmRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/registration-confirmation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ confirmationCode: code.trim() }),
    })
    if (confirmRes.status === 204) {
      return (
        <EmailVerification title="Congratulations!" description="Your email has been confirmed" imageSrc={infoImg}>
          <div className={s.confirmWrapper}>
            <Button as={Link} fullWidth href={PATH.AUTH.LOGIN}>
              Sign in
            </Button>
          </div>
        </EmailVerification>
      )
    }
    // Обработка ошибки неверного кода (400 Bad Request)
    if (confirmRes.status === 400) {
      const errorData = await confirmRes.json()
      console.error('Network error:', errorData.messages?.[0]?.message)
      return <LinkExpired />
    }
    // Обработка других ошибок
    return <EmailVerification title="Error" description="Please try again later" />
  } catch (error) {
    console.error('Network error:', error)
    return <EmailVerification title="Network Error" description="Could not connect to the server" />
  }
}
