'use client'

import Image, { StaticImageData } from 'next/image'
import { useEffect, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link, usePathname, useRouter } from '@/i18n/navigation'

import { useGetMeQuery } from '@/features/auth/api/authApi'
import { NotificationsPopover } from '@/features/notifications/ui/NotificationsPopover'
import { PATH } from '@/shared/config/routes'
import { Button, SelectBox, SelectItem } from '@/shared/ui'

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

const AuthActions = () => {
  const t = useTranslations('header')
  return (
    <div className={s.buttons}>
      <Button as={Link} href={PATH.AUTH.LOGIN} size="small" variant="text">
        {t('login')}
      </Button>
      <Button as={Link} href={PATH.AUTH.REGISTRATION} size="small" variant="primary">
        {t('signup')}
      </Button>
    </div>
  )
}

export const Header = () => {
  const { data: user, isLoading } = useGetMeQuery()
  const tHeader = useTranslations('header')
  const tLang = useTranslations('languages')
  const locale = useLocale() // -> 'en' | 'ru'
  const router = useRouter()
  const pathname = usePathname()
  const [showButtons, setShowButtons] = useState(true)

  useEffect(() => {
    if (!isLoading) setShowButtons(!user)
  }, [isLoading, user])

  const handleLanguageChange = (nextLocale: string) => {
    router.replace(pathname, { locale: nextLocale as 'en' | 'ru' })
  }

  return (
    <header className={s.header}>
      <div className={s.container}>
        <Link href={PATH.ROOT} className={s.logo}>
          <Image src={Logo} alt="logo" width={40} height={40} />
          <Image src={Letters} alt="logo" height={20} />
        </Link>

        <div className={s.actions}>
          <div className={s.notificationContainer}>{user && <NotificationsPopover />}</div>

          <SelectBox
            className={s.selector}
            placeholder={tHeader('chooseLanguage')}
            onValueChange={handleLanguageChange}
            value={locale}
          >
            <SelectItem value="en">
              <LanguageSelect flag={flagUnitedKingdom} language={tLang('english')} />
            </SelectItem>
            <SelectItem value="ru">
              <LanguageSelect flag={flagRussia} language={tLang('russian')} />
            </SelectItem>
          </SelectBox>

          <div className={s.authActions}>{showButtons && !user && <AuthActions />}</div>
        </div>
      </div>
    </header>
  )
}
