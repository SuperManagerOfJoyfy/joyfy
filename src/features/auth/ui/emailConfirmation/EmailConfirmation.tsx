'use client'
import { EmailVerification } from '@/features/auth/ui/emailVerification'
import { Button } from '@/shared/ui'
import React, { useEffect } from 'react'
import infoImg from '@/features/auth/assets/images/EmailVerification/confirm.png'
import { useConfirmEmailMutation } from '@/features/auth/api/authApi'
import Link from 'next/link'
import { PATH } from '@/shared/config/routes'
import { Loader } from '@/shared/ui/loader/Loader'
import { useSearchParams } from 'next/navigation'

const EmailConfirmation = () => {
  const searchParams = useSearchParams()
  const code = searchParams.get('code')
  const [confirmEmail, { isLoading, isUninitialized }] = useConfirmEmailMutation()

  useEffect(() => {
    if (!code) return

    confirmEmail({ confirmationCode: code })
  }, [code])

  if (!code) return null

  if (isUninitialized || isLoading) {
    return <Loader fullScreen />
  }

  return (
    <EmailVerification
      title="Congratulations!"
      description="Your email has been confirmed"
      imageSrc={infoImg}
      className=""
    >
      <div style={{ marginTop: '54px', maxWidth: '182px', width: '100%' }}>
        <Button as={Link} fullWidth href={PATH.AUTH.LOGIN}>
          Sign in
        </Button>
      </div>
    </EmailVerification>
  )
}

export default EmailConfirmation
