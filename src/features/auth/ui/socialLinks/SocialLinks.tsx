'use client'

import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { Button } from '@/shared/ui'
import { toast } from 'react-toastify'
import { useAuth } from '../../hooks/useAuth'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import s from './socialLinks.module.scss'

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

const SOCIAL_AUTH_CONFIG = {
  google: {
    icon: <FcGoogle className={s.icon} />,
    url: baseUrl ? `${baseUrl}/auth/google` : undefined,
  },
  github: {
    icon: <FaGithub className={s.icon} />,
    url: baseUrl ? `${baseUrl}/auth/github` : undefined,
  },
} as const

type SocialLinksProps = {
  isDisabled: boolean
  onStartLoading: () => void
}

type SocialProvider = keyof typeof SOCIAL_AUTH_CONFIG

export const SocialLinks = ({
  isDisabled,
  onStartLoading,
}: SocialLinksProps) => {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const provider = searchParams.get('provider')
    const error = searchParams.get('error')

    if (
      provider &&
      error &&
      Object.keys(SOCIAL_AUTH_CONFIG).includes(provider)
    ) {
      toast.error(`Authentication with ${provider} failed: ${error}`)
    }
  }, [searchParams])

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  if (isAuthenticated) return null

  const handleSocialLogin = (
    e: React.MouseEvent<HTMLAnchorElement>,
    provider: SocialProvider
  ) => {
    if (isDisabled || !SOCIAL_AUTH_CONFIG[provider].url) {
      e.preventDefault()
      if (!SOCIAL_AUTH_CONFIG[provider].url) {
        toast.error('API URL is not configured. Please contact support.')
      }
      return
    }

    onStartLoading()
  }

  return (
    <div className={s.iconsContainer}>
      {Object.entries(SOCIAL_AUTH_CONFIG).map(([provider, config]) => (
        <Button
          key={provider}
          as="a"
          variant="icon"
          href={config.url || '#'}
          onClick={(e) => handleSocialLogin(e, provider as SocialProvider)}
          className={`${s.iconBtn} ${isDisabled ? s.disabled : ''}`}
          aria-disabled={isDisabled}
        >
          {config.icon}
        </Button>
      ))}
    </div>
  )
}
