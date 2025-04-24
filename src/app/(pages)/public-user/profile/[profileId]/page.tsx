import { UserProfile, UserProfileType } from '@/features/post/ui/userProfile'

type PageProps = {
  params: Promise<{ profileId: string }>
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params

  const data = await fetch(
    `https://joyfy.online/api/v1/public-user/profile/${resolvedParams.profileId}`
  )

  const userData: UserProfileType = await data.json()


  return (
    <div>
      <UserProfile
        userName={userData.userName}
        userMetadata={userData.userMetadata}
        aboutMe={userData.aboutMe}
        avatars={userData.avatars}
        hasPaymentSubscription={userData.hasPaymentSubscription}
        id={userData.id}
      />
    </div>
  )
}
