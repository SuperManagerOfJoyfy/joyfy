'use client'

import { useState } from 'react'
import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { Button, Typography } from '@/shared/ui'
import s from './socialLinks.module.scss'

type SocialLinksProps = {
  isDisabled: boolean
  onStartLoading: () => void
}

export const SocialLinks = ({ isDisabled, onStartLoading }: SocialLinksProps) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  const [error, setError] = useState<string | null>(null)

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    provider: 'google' | 'github'
  ) => {
    if (isDisabled) {
      e.preventDefault()
      return
    }

    if (!baseUrl) {
      e.preventDefault()
      setError('API URL is not set.')
      return
    }

    onStartLoading()
    setError(null)

    try {
      localStorage.setItem('auth_pending', provider)
      localStorage.setItem('auth_timestamp', Date.now().toString())
    } catch (err) {
      console.error('Failed to store auth state:', err)
    }
  }

  return (
    <div className={s.iconsContainer}>
      <Button
        as="a"
        variant="icon"
        href={`${baseUrl}/auth/google`}
        onClick={(e) => handleClick(e, 'google')}
        className={`${s.iconBtn} ${isDisabled ? s.disabled : ''}`}
        aria-disabled={isDisabled}
      >
        <FcGoogle className={s.icon} />
      </Button>

      <Button
        as="a"
        variant="icon"
        href={`${baseUrl}/auth/github`}
        onClick={(e) => handleClick(e, 'github')}
        className={`${s.iconBtn} ${isDisabled ? s.disabled : ''}`}
        aria-disabled={isDisabled}
      >
        <FaGithub className={s.icon} />
      </Button>

      {error && (
        <Typography variant="caption" className={s.error}>
          {error}
        </Typography>
      )}
    </div>
  )
}
