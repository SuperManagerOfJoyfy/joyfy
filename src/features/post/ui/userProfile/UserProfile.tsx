'use client'

import React from 'react'
import Image from 'next/image'
import s from './UserProfile.module.scss'
import { Typography } from '@/shared/ui'
import defaultAvatar from '../../../../../public/default-avatar.png'

type Avatar = {
  url: string
  width: number
  height: number
  fileSize: number
  createdAt: string
}

type MetaData = {
  following: number
  followers: number
  publications: number
}

export type UserProfileType = {
  id: number
  userName: string
  aboutMe: string | null
  avatars: Avatar[]
  userMetadata: MetaData
  hasPaymentSubscription: boolean
}

type StatItem = {
  value: number
  label: string
}

const StatItem = ({ value, label }: StatItem) => (
  <div className={s.statItem}>
    <Typography variant={'h2'}>{value}</Typography>
    <Typography variant={'body1'}>{label}</Typography>
  </div>
)

export const UserProfile = ({
  id,
  userName,
  aboutMe,
  avatars,
  userMetadata,
  hasPaymentSubscription,
}: UserProfileType) => {
  const profileAvatar: Avatar = avatars?.[0]

  const isAvatarValid = (profileAvatar: Avatar): boolean => {
    if (!profileAvatar) return false
    return (
      Boolean(profileAvatar.url?.trim()) &&
      profileAvatar.width > 0 &&
      profileAvatar.height > 0
    )
  }

  console.log('LOGGER: ' + isAvatarValid(profileAvatar))
  return (
    <div className={s.profileContainer} key={id}>
      <div className={s.profileImageContainer}>
        <div className={s.profileImageWrapper}>
          {isAvatarValid(profileAvatar) ? (
            <Image
              src={profileAvatar.url}
              width={profileAvatar.width}
              height={profileAvatar.height}
              alt={`${userName}'s avatar`}
            />
          ) : (
            <Image
              src={defaultAvatar}
              width={204}
              height={204}
              alt="default avatar"
            />
          )}
        </div>
      </div>

      <div className={s.profileInfo}>
        <Typography variant={'large'} fontWeight={'medium'}>
          {userName}
        </Typography>

        <div className={s.profileStats}>
          <StatItem value={userMetadata.following} label="Following" />
          <StatItem value={userMetadata.followers} label="Followers" />
          <StatItem value={userMetadata.publications} label="Publications" />
        </div>

        <Typography className={s.profileBio}>
          {aboutMe ||
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut' +
              ' labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco '}
        </Typography>

        {/*{hasPaymentSubscription && (*/}
        {/*  <p className={s.subscriptionBadge}>✔ Подписка активна</p>*/}
        {/*)}*/}
      </div>
    </div>
  )
}
