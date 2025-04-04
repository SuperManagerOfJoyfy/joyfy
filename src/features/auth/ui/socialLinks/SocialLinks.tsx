'use client'

import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { Button } from '@/shared/ui'
import { toast } from 'react-toastify'
import s from './socialLinks.module.scss'

type SocialLinksProps = {
  isDisabled: boolean
  onStartLoading: () => void
}

type SocialProvider = 'google' | 'github'

export const SocialLinks = ({
  isDisabled,
  onStartLoading,
}: SocialLinksProps) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

  const handleSocialLogin = (
    e: React.MouseEvent<HTMLAnchorElement>,
    provider: SocialProvider
  ) => {
    if (isDisabled) {
      e.preventDefault()
      return
    }

    if (!baseUrl) {
      e.preventDefault()
      toast.error('API URL is not configured. Please contact support.')
      return
    }

    onStartLoading()
  }

  const renderSocialButton = (provider: SocialProvider) => {
    const config = {
      google: {
        icon: <FcGoogle className={s.icon} />,
        url: `${baseUrl}/auth/google`,
      },
      github: {
        icon: <FaGithub className={s.icon} />,
        url: `${baseUrl}/auth/github`,
      },
    }

    return (
      <Button
        as="a"
        variant="icon"
        href={config[provider].url}
        onClick={(e) => handleSocialLogin(e, provider)}
        className={`${s.iconBtn} ${isDisabled ? s.disabled : ''}`}
        aria-disabled={isDisabled}
      >
        {config[provider].icon}
      </Button>
    )
  }

  return (
    <div className={s.iconsContainer}>
      {renderSocialButton('google')}
      {renderSocialButton('github')}
    </div>
  )
}
