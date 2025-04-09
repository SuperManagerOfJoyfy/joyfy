'use client'

import React, { useState, useEffect } from 'react'
import s from './Header.module.scss'
import { SelectBox, SelectItem } from '@/shared/ui/selectBox/SelectBox'
import { Button } from '@/shared/ui/button'
import { IoNotificationsOutline } from 'react-icons/io5'
import flagUnitedKingdom from '@/shared/ui/header/assets/flagUnitedKingdom.png'
import flagRussia from '@/shared/ui/header/assets/flagRussia.png'
import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/features/auth/hooks/useAuth'
import Logo from '../../../../public/logo/logo.png'
import Letters from '../../../../public/logo/letters.png'

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
    <Button as={Link} href="/auth/login" size="small" variant="text">
      Log in
    </Button>
    <Button as={Link} href="/auth/registration" size="small" variant="primary">
      Sign up
    </Button>
  </div>
)

export const Header = () => {
  const [notificationCount] = useState(3)
  const { isAuthenticated, isLoading } = useAuth()
  const [showButtons, setShowButtons] = useState(true)

  useEffect(() => {
    if (!isLoading) {
      setShowButtons(!isAuthenticated)
    }
  }, [isLoading, isAuthenticated])

  return (
    <header className={s.header}>
      <div className={s.container}>
        <div className={s.logo}>
          <Image src={Logo} alt="logo" width={45} height={45} />
          <Image src={Letters} alt="logo" height={30} />
        </div>
        <div className={s.actions}>
          <div className={s.notificationContainer}>
            {isAuthenticated && (
              <div className={s.notifications}>
                <IoNotificationsOutline />
                {notificationCount !== 0 && (
                  <span className={s.number}>{notificationCount}</span>
                )}
              </div>
            )}
          </div>

          <SelectBox className={s.selector} placeholder="Choose language">
            <SelectItem value="English">
              <LanguageSelect flag={flagUnitedKingdom} language="English" />
            </SelectItem>
            <SelectItem value="Russian">
              <LanguageSelect flag={flagRussia} language="Russian" />
            </SelectItem>
          </SelectBox>

          <div className={s.authActions}>{showButtons && <AuthActions />}</div>
        </div>
      </div>
    </header>
  )
}
