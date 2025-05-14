'use client'

import Image from 'next/image'
import s from './UserProfile.module.scss'
import { Button, Typography } from '@/shared/ui'
import defaultAvatar from '../../../../../public/default-avatar.png'
import verifiedBudget from '../../../../../public/verifiedBudget.svg'
import { useGetMeQuery } from '@/features/auth/api/authApi'

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

export type UserProfileProps = {
  id: number
  userName: string
  aboutMe: string | null
  avatars: Avatar[]
  userMetadata: MetaData
  hasPaymentSubscription: boolean
}

type StatItemProps = {
  value: number
  label: string
}

const StatItem = ({ value, label }: StatItemProps) => (
  <div className={s.statItem}>
    <Typography variant={'h2'}>{value}</Typography>
    <Typography variant={'body1'}>{label}</Typography>
  </div>
)

export const UserProfile = ({ userName, aboutMe, avatars, userMetadata, hasPaymentSubscription }: UserProfileProps) => {
  const { data: user } = useGetMeQuery()

  const profileAvatar: Avatar | undefined = avatars?.[0]

  const isAvatarValid = (profileAvatar: Avatar): boolean => {
    if (!profileAvatar) return false
    return Boolean(profileAvatar.url?.trim()) && profileAvatar.width > 0 && profileAvatar.height > 0
  }

  const bioText =
    aboutMe ||
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore' +
      ' magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco'

  return (
    <div className={s.profileContainer}>
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
            <Image src={defaultAvatar} width={204} height={204} alt="default avatar" priority />
          )}
        </div>
      </div>

      <div className={s.profileInfoContainer}>
        <div className={s.profileHeader}>
          <div className={s.profileNameBudget}>
            <Typography variant="large" fontWeight="medium">
              {userName}
            </Typography>
            {hasPaymentSubscription && (
              <Image src={verifiedBudget} width={24} height={24} alt="verifiedIcon" priority />
            )}
          </div>
          {user && <Button variant={'secondary'}>Profile Settings</Button>}
        </div>
        <div className={s.profileStats}>
          <StatItem value={userMetadata.following} label="Following" />
          <StatItem value={userMetadata.followers} label="Followers" />
          <StatItem value={userMetadata.publications} label="Publications" />
        </div>
        <Typography className={s.profileBio}>{bioText}</Typography>
      </div>
    </div>
  )
}
