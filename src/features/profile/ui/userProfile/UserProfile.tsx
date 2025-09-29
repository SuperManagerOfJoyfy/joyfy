'use client'

import Image from 'next/image'
import s from './UserProfile.module.scss'
import { Button, Typography } from '@/shared/ui'
import verifiedBudget from '../../../../../public/verifiedBudget.svg'
import { useGetMeQuery } from '@/features/auth/api/authApi'
import { PublicUserProfile, UserProfileWithFollowers } from '@/features/profile/api/profileApi.types'
import { PATH } from '@/shared/config/routes'
import { Avatar } from '@/shared/ui/avatar/Avatar'
import {
  useFollowUserByIdMutation,
  useGetUserProfileWithFollowersQuery,
  useUnfollowUserByIdMutation,
} from '@/features/profile/api'
import { MeResponse } from '@/features/auth/api/authApi.types'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

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
  const t = useTranslations('userProfile')

  const { data: me = {} as MeResponse } = useGetMeQuery()
  const { data: user = {} as UserProfileWithFollowers } = useGetUserProfileWithFollowersQuery(userProfile.userName)
  const [followById, { isLoading: followIsLoading }] = useFollowUserByIdMutation()
  const [unfollow, { isLoading: unfollowIsLoading }] = useUnfollowUserByIdMutation()

  const profileAvatar = userProfile.avatars[0]?.url
  const bioText = userProfile.aboutMe || ''

  return (
    <div className={s.profileContainer}>
      <div className={s.profileImageContainer}>
        <div className={s.profileImageWrapper}>
          <Avatar name={userProfile.userName} size={'large'} avatar={profileAvatar} />
        </div>
      </div>

      <div className={s.profileInfoContainer}>
        <div className={s.profileHeader}>
          <div className={s.profileNameBudget}>
            <Typography variant="large" fontWeight="medium">
              {userProfile.userName}
            </Typography>
            {userProfile.hasPaymentSubscription && (
              <Image src={verifiedBudget} width={24} height={24} alt="verifiedIcon" priority />
            )}
          </div>
          {me.userId === userProfile.id && (
            <Button as={Link} href={`${PATH.USER.SETTINGS}?part=info`} variant="secondary">
              {t('settings')}
            </Button>
          )}
          {me.userId !== userProfile.id && (
            <div className={s.followBlock}>
              {user.isFollowing ? (
                <Button
                  as={'button'}
                  variant={'outline'}
                  onClick={() => {
                    unfollow(userProfile.id)
                  }}
                  disabled={unfollowIsLoading}
                >
                  {t('unfollow')}
                </Button>
              ) : (
                <Button
                  as={'button'}
                  variant={'primary'}
                  onClick={() => {
                    followById(userProfile.id)
                  }}
                  disabled={followIsLoading}
                >
                  {t('follow')}
                </Button>
              )}
              <Button as={Link} href={`${PATH.USER.MESSENGER}/${userProfile.id}`} variant="secondary">
                {t('sendMessage')}
              </Button>
            </div>
          )}
        </div>
        <div className={s.profileStats}>
          <StatItem value={user.followingCount} label={t('stats.following')} />
          <StatItem value={user.followersCount} label={t('stats.followers')} />
          <StatItem value={user.publicationsCount} label={t('stats.publications')} />
        </div>
        <Typography className={s.profileBio}>{bioText}</Typography>
      </div>
    </div>
  )
}
