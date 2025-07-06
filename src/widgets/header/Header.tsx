'use client'

import Link from 'next/link'
import Image, { StaticImageData } from 'next/image'
import { useEffect, useState } from 'react'
import { useGetMeQuery } from '@/features/auth/api/authApi'
import { NotificationsList } from '@/features/notifications/ui'
import { useNotificationsData } from '@/features/notifications/hooks/useNotificationsData'

import { PATH } from '@/shared/config/routes'
import { Button, DropdownMenu, SelectBox, SelectItem } from '@/shared/ui'
import { DropdownMenuArrow } from '@/shared/ui/dropdownMenu'
import { IoNotificationsOutline } from 'react-icons/io5'
import Letters from '../../../public/logo/letters.png'
import Logo from '../../../public/logo/logo.png'
import flagRussia from './assets/flagRussia.png'
import flagUnitedKingdom from './assets/flagUnitedKingdom.png'
import s from './Header.module.scss'

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
  const { data: user, isLoading } = useGetMeQuery()
  const [showButtons, setShowButtons] = useState(true)

  const notifications = useNotificationsData()
  const notReadCount = notifications?.notReadCount ?? 0

  useEffect(() => {
    if (!isLoading) {
      setShowButtons(!user)
    }
  }, [isLoading, user])

  return (
    <header className={s.header}>
      <div className={s.container}>
        <Link href={PATH.ROOT} className={s.logo}>
          <Image src={Logo} alt="logo" width={40} height={40} />
          <Image src={Letters} alt="logo" height={20} />
        </Link>
        <div className={s.actions}>
          <div className={s.notificationContainer}>
            {user && (
              <div className={s.notifications}>
                <DropdownMenu trigger={<IoNotificationsOutline />} contentClassName={s.dropdown}>
                  <DropdownMenuArrow />
                  <NotificationsList />
                </DropdownMenu>

                {notReadCount !== 0 && <span className={s.number}>{notReadCount}</span>}
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

          <div className={s.authActions}>{showButtons && !user && <AuthActions />}</div>
        </div>
      </div>
    </header>
  )
}
