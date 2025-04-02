'use client'

import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import s from './socialLinks.module.scss'
import Link from 'next/link'
import type { MouseEvent as ReactMouseEvent } from 'react'

type SocialLinksProps = {
  isDisabled: boolean
  onStartLoading: () => void
}

export const SocialLinks = ({
  isDisabled,
  onStartLoading,
}: SocialLinksProps) => {

  const base = process.env.NEXT_PUBLIC_API_BASE_URL

  const handleClick = (
    e: ReactMouseEvent<HTMLAnchorElement>,
    provider: 'google' | 'github'
  ) => {
    if (isDisabled) {
      e.preventDefault()
      return
    }
    onStartLoading()
  }

  return (
    <div className={s.iconsContainer}>
      <Link
        href={`${base}/auth/google`}
        onClick={(e) => handleClick(e, 'google')}
        className={`${s.iconBtn} ${isDisabled ? s.disabled : ''}`}
        aria-disabled={isDisabled}
      >
        <FcGoogle className={s.icon} />
      </Link>

      <Link
        href={`${base}/auth/github`}
        onClick={(e) => handleClick(e, 'github')}
        className={`${s.iconBtn} ${isDisabled ? s.disabled : ''}`}
        aria-disabled={isDisabled}
      >
        <FaGithub className={s.icon} />
      </Link>
    </div>
  )
}
