'use client'

import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import s from './socialLinks.module.scss'
import { Button } from '@/shared/ui'

type SocialLinksProps = {
  isDisabled: boolean
  onStartLoading: () => void
}

export const SocialLinks = ({
  isDisabled,
  onStartLoading,
}: SocialLinksProps) => {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL

  const handleGoogleLogin = () => {
    onStartLoading()
    window.location.href = `${base}/auth/google`
  }

  const handleGithubLogin = () => {
    onStartLoading()
    window.location.href = `${base}/auth/github`
  }

  return (
    <div className={s.iconsContainer}>
      <Button
        variant={'icon'}
        onClick={handleGoogleLogin}
        className={s.iconBtn}
        disabled={isDisabled}
      >
        <FcGoogle className={s.icon} />
      </Button>
      <Button
        variant={'icon'}
        onClick={handleGithubLogin}
        className={s.iconBtn}
        disabled={isDisabled}
      >
        <FaGithub className={s.icon} />
      </Button>
    </div>
  )
}
