import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import s from './socialLinks.module.scss'
import { Button } from '@/shared/ui'
import { useState } from 'react'

export const SocialLinks = () => {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL

  const [isLoading, setIsLoading] = useState({
    google: false,
    github: false,
  })

  const handleGoogleLogin = () => {
    setIsLoading((prev) => ({ ...prev, google: true }))
    window.location.href = `${base}/auth/google/callback`
  }

  const handleGithubLogin = () => {
    setIsLoading((prev) => ({ ...prev, github: true }))
    window.location.href = `${base}/auth/github/callback`
  }

  return (
    <div className={s.iconsContainer}>
      <Button
        variant={'icon'}
        onClick={handleGoogleLogin}
        className={s.iconBtn}
        disabled={isLoading.google}
      >
        <FcGoogle className={s.icon} />
        {isLoading.google && <span className={s.loadingIndicator}>⏳</span>}
      </Button>
      <Button
        variant={'icon'}
        onClick={handleGithubLogin}
        className={s.iconBtn}
        disabled={isLoading.github}
      >
        <FaGithub className={s.icon} />
        {isLoading.github && <span className={s.loadingIndicator}>⏳</span>}
      </Button>
    </div>
  )
}
