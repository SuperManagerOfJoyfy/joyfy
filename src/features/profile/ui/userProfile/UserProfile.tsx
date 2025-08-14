'use client'

import Image from 'next/image'
import s from './UserProfile.module.scss'
import { Button, Typography } from '@/shared/ui'
import verifiedBudget from '../../../../../public/verifiedBudget.svg'
import { useGetMeQuery } from '@/features/auth/api/authApi'
import { PublicUserProfile, UserProfileWithFollowers } from '@/features/profile/api/profileApi.types'
import Link from 'next/link'
import { PATH } from '@/shared/config/routes'
import { Avatar } from '@/shared/ui/avatar/Avatar'
import {
  useFollowUserByIdMutation,
  useGetUserProfileWithFollowersQuery,
  useUnfollowUserByIdMutation,
} from '@/features/profile/api'
import { MeResponse } from '@/features/auth/api/authApi.types'

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
/*тут получается так, что бекенд плохо сделан, ибо есть два почти идентичных эндпоинта на запрос юзера,
но один это для SSR который делается в родительской компоненте и данные сюда приходят в пропсах, а другой этo
тот который делаеться внутри UserProfile и имеет всё то же только завязка на подписках и рабочее значение
количества публикация и правильным отображением лайков при ховере на пост в гриде по этому специально не делал
деструктуризацию userProfile чтобы не было путаницы в нейминге*/

export const UserProfile = (userProfile: PublicUserProfile) => {
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
              Profile Settings
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
                  Unfollow
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
                  Follow
                </Button>
              )}
              <Button as={Link} href={`${PATH.USER.MESSENGER}/${userProfile.id}`} variant="secondary">
                Send Message
              </Button>
            </div>
          )}
        </div>
        <div className={s.profileStats}>
          <StatItem value={user.followingCount} label="Following" />
          <StatItem value={user.followersCount} label="Followers" />
          <StatItem value={user.publicationsCount} label="Publications" />
        </div>
        <Typography className={s.profileBio}>{bioText}</Typography>
      </div>
    </div>
  )
}
