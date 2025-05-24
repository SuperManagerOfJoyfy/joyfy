'use client'

import Image from 'next/image'
import s from './UserProfile.module.scss'
import { Button, Typography } from '@/shared/ui'
import verifiedBudget from '../../../../../public/verifiedBudget.svg'
import { useGetMeQuery } from '@/features/auth/api/authApi'
import { useAppDispatch } from '@/app/store/store'
import { useEffect } from 'react'
import { profileApi, useGetPublicUserProfileQuery } from '@/features/profile/api/profileApi'
import { useParams } from 'next/navigation'
import { PublicUserProfile } from '@/features/profile/api/profileApi.types'
import Link from 'next/link'
import { PATH } from '@/shared/config/routes'
import { Avatar } from '@/shared/ui/avatar/Avatar'

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

export const UserProfile = (userProfile: PublicUserProfile) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (userProfile) {
      dispatch(profileApi.util.upsertQueryData('getPublicUserProfile', id, userProfile))
    }
  }, [dispatch, userProfile])

  const params = useParams()
  const id = String(params?.id)

  const { data: user } = useGetMeQuery()
  const { data: profile } = useGetPublicUserProfileQuery(id)

  if (!profile) return null

  const { userName, aboutMe, avatars, userMetadata, hasPaymentSubscription } = profile

  const profileAvatar = avatars?.[0]?.url ?? ''

  const bioText = aboutMe || ''

  return (
    <div className={s.profileContainer}>
      <div className={s.profileImageContainer}>
        <div className={s.profileImageWrapper}>
          <Avatar name={userName} size={'large'} avatar={profileAvatar} />
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
          {user && (
            <Button as={Link} href={`${PATH.USER.SETTINGS}?part=info`} variant="secondary">
              Profile Settings
            </Button>
          )}
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
