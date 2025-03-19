import React from 'react'
import s from './Header.module.scss'
import { SelectBox, SelectItem } from '@/shared/ui/selectBox/SelectBox'
import { Button } from '@/shared/ui/button'
import { IoNotificationsOutline } from 'react-icons/io5'
import flagUnitedKingdom from '@/assets/images/flagUnitedKingdom.png'
import flagRussia from '@/assets/images/flagRussia.png'
import Image from 'next/image'

type Props = {
  isAuthenticated: boolean
  notification?: number
}

export const Header = ({ isAuthenticated, notification = 3 }: Props) => {
  const options = [
    {
      value: 'russian',
      children: (
        <div className={s.selectItem}>
          <Image src={flagRussia} alt="RU flag" width={20} height={20} />{' '}
          Russian
        </div>
      ),
    },
    {
      value: 'english',
      children: (
        <div className={s.selectItem}>
          <Image src={flagUnitedKingdom} alt="UK flag" width={20} height={20} />{' '}
          English
        </div>
      ),
    },
  ]
  const EnglishLanguageSelect = () => {
    return (
      <div className={s.selectItem}>
        <Image src={flagUnitedKingdom} alt="UK flag" width={20} height={20} />{' '}
        English
      </div>
    )
  }
  const RussianLanguageSelect = () => {
    return (
      <div className={s.selectItem}>
        <Image src={flagRussia} alt="RU flag" width={20} height={20} /> Russian
      </div>
    )
  }

  return (
    <header className={s.header}>
      <div className={s.container}>
        <div className={s.logo}>Inctagram</div>
        <div>
          {isAuthenticated ? (
            <div className={s.actions}>
              <div className={s.notifications}>
                <IoNotificationsOutline />
                {notification !== 0 && (
                  <span className={s.number}>{notification}</span>
                )}
              </div>
              <SelectBox className={s.selector} placeholder={'Chose language'}>
                <SelectItem value={'English'}>
                  <EnglishLanguageSelect />
                </SelectItem>
                <SelectItem value={'Russian'}>
                  <RussianLanguageSelect />
                </SelectItem>
              </SelectBox>
            </div>
          ) : (
            <div className={s.actions}>
              <SelectBox className={s.selector} placeholder={'Chose language'}>
                <SelectItem value={'English'}>
                  <EnglishLanguageSelect />
                </SelectItem>
                <SelectItem value={'Russian'}>
                  <RussianLanguageSelect />
                </SelectItem>
              </SelectBox>
              <div className={s.buttons}>
                <Button size={'small'} variant={'text'}>
                  Log in
                </Button>
                <Button size={'small'} variant={'primary'}>
                  Sign up
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
