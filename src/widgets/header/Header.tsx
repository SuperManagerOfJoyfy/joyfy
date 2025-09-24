'use client'

import { useGetMeQuery } from '@/features/auth/api/authApi'
import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { NotificationsPopover } from '@/features/notifications/ui/NotificationsPopover'
import { PATH } from '@/shared/config/routes'
import { Button, SelectBox, SelectItem, UserCard } from '@/shared/ui'
import Letters from '../../../public/logo/letters.png'
import Logo from '../../../public/logo/logo.png'
import flagRussia from './assets/flagRussia.png'
import flagUnitedKingdom from './assets/flagUnitedKingdom.png'
import s from './Header.module.scss'
import { useGetUserProfileQuery } from '@/features/profile/api'

type LanguageSelectProps = {
  flag: StaticImageData
  language: string
}

const LanguageSelect = ({ flag, language }: LanguageSelectProps) => (
  <div className={s.selectItem}>
    <Image src={flag} alt={`${language} flag`} width={20} height={20} />
    {language}
  </div>
)

const AuthActions = () => (
  <div className={s.buttons}>
    <Button as={Link} href={PATH.AUTH.LOGIN} size="small" variant="text">
      Log in
    </Button>
    <Button as={Link} href={PATH.AUTH.REGISTRATION} size="small" variant="primary">
      Sign up
    </Button>
  </div>
)

export const Header = () => {
  const { data: me, isLoading: isMeLoading } = useGetMeQuery()
  const [showButtons, setShowButtons] = useState(true)
  const { data: profile, isLoading: isProfileLoading } = useGetUserProfileQuery(undefined, { skip: !me?.userId })

  useEffect(() => {
    if (!isMeLoading) {
      setShowButtons(!me)
    }
  }, [isMeLoading, me])

  const currentUser =
    me && profile
      ? {
          id: me.userId,
          userName: me.userName,
          avatar: profile.avatars?.[0]?.url ?? '',
        }
      : null

  return (
    <header className={s.header}>
      <div className={s.container}>
        <Link href={PATH.ROOT} className={s.logo}>
          <Image src={Logo} alt="logo" width={40} height={40} />
          <Image src={Letters} alt="logo" height={20} />
        </Link>
        <div className={s.actions}>
          {currentUser && <UserCard user={currentUser} />}
          <div className={s.notificationContainer}>{me && <NotificationsPopover />}</div>

          <SelectBox className={s.selector} placeholder="Choose language">
            <SelectItem value="English">
              <LanguageSelect flag={flagUnitedKingdom} language="English" />
            </SelectItem>
            <SelectItem value="Russian">
              <LanguageSelect flag={flagRussia} language="Russian" />
            </SelectItem>
          </SelectBox>

          <div className={s.authActions}>{showButtons && !me && <AuthActions />}</div>
        </div>
      </div>
    </header>
  )
}
