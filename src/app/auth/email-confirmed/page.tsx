"use client"
import { EmailVerification } from '@/features/auth/ui/emailVerification'
import { Button } from '@/shared/ui'
import React, { useEffect } from 'react'
import infoImg from '@/features/auth/assets/images/EmailVerification/confirm.png'
import { useSearchParams } from 'next/navigation'
import { useConfirmEmailMutation } from '@/features/auth/api/authApi'
import Link from 'next/link'
import { PATH } from '@/shared/config/routes'

const EmailConfirmation = () => {
	const searchParams = useSearchParams()
	const code = searchParams.get('code')
	const [confirmEmail, { isLoading, isUninitialized }] = useConfirmEmailMutation();

	useEffect(() => {
		if (!code) return;

		confirmEmail({ code })
	}, [code])

	if (isUninitialized || isLoading) {
		return <div>Loading...</div>;
	}
	return (
		<EmailVerification title='Congratulations!' description='Your email has been confirmed' imageSrc={infoImg} className=''>
			<div style={{ marginTop: '54px', maxWidth: '182px', width: '100%' }}>
				<Button as={Link} fullWidth href={PATH.AUTH.LOGIN}>Sign in</Button>
			</div>
		</EmailVerification>
	)
}

export default EmailConfirmation
