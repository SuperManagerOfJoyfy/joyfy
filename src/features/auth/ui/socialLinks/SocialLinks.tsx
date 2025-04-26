'use client'

import { Button } from '@/shared/ui'
import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { useCallback } from 'react'
import s from './socialLinks.module.scss'

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://joyfy.online/api/v1'

const frontendUrl =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://joyfy.online'

type SocialLinksProps = {
  isDisabled: boolean
  onStartLoading: () => void
}

export const SocialLinks = ({
  isDisabled,
  onStartLoading,
}: SocialLinksProps) => {
  const handleGithubLogin = useCallback(() => {
    if (isDisabled) return

    onStartLoading()

    const redirectUrl = `${frontendUrl}/auth/github`
    const githubAuthUrl = `${apiBaseUrl}/auth/github/login?redirect_url=${encodeURIComponent(redirectUrl)}`

    window.location.href = githubAuthUrl
  }, [isDisabled, onStartLoading])

  const handleGoogleLogin = useCallback(() => {
    if (isDisabled) return

    onStartLoading() 

    const redirectUrl = `${frontendUrl}/auth/google`
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUrl)}&response_type=code&scope=email%20profile&prompt=select_account`

    window.location.href = googleAuthUrl
  }, [isDisabled, onStartLoading])

  return (
    <div className={s.iconsContainer}>
      <Button
        variant="icon"
        onClick={handleGithubLogin}
        className={`${s.iconBtn} ${isDisabled ? s.disabled : ''}`}
        aria-disabled={isDisabled}
      >
        <FaGithub className={s.icon} />
      </Button>
      <Button
        variant="icon"
        onClick={handleGoogleLogin}
        className={`${s.iconBtn} ${isDisabled ? s.disabled : ''}`}
        aria-disabled={isDisabled}
      >
        <FcGoogle className={s.icon} />
      </Button>
    </div>
  )
}
