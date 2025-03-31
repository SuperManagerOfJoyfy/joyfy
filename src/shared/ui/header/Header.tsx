import React from 'react'
import s from './Header.module.scss'
import { SelectBox, SelectItem } from '@/shared/ui/selectBox/SelectBox'
import { Button } from '@/shared/ui/button'
import { IoNotificationsOutline } from 'react-icons/io5'
import flagUnitedKingdom from '@/assets/images/flagUnitedKingdom.png'
import flagRussia from '@/assets/images/flagRussia.png'
import Image, { StaticImageData } from 'next/image'

type Props = {
  isAuthenticated: boolean
  notification?: number
}

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
    <Button size={'small'} variant={'text'}>
      Log in
    </Button>
    <Button size={'small'} variant={'primary'}>
      Sign up
    </Button>
  </div>
)

export const Header = ({ isAuthenticated, notification = 3 }: Props) => (
  <header className={s.header}>
    <div className={s.container}>
      <div className={s.logo}>Inctagram</div>
      <div>
        <div className={s.actions}>
          <div className={s.notifications}>
            <IoNotificationsOutline />
            {notification !== 0 && (
              <span className={s.number}>{notification}</span>
            )}
          </div>
          <SelectBox className={s.selector} placeholder={'Choose language'}>
            <SelectItem value={'English'}>
              <LanguageSelect flag={flagUnitedKingdom} language="English" />
            </SelectItem>
            <SelectItem value={'Russian'}>
              <LanguageSelect flag={flagRussia} language="Russian" />
            </SelectItem>
          </SelectBox>
          {!isAuthenticated && <AuthActions />}
        </div>
      </div>
    </div>
  </header>
)
