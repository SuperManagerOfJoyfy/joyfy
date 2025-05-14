import { UserProfile, UserProfileProps } from '@/features/profile/ui/userProfile'
import { PostsGridWithInfinteScroll } from '@/features/post/ui/postsGridWithInfiniteScroll/PostsGridWithInfinteScroll'

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params

  const data = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/public-user/profile/${resolvedParams.id}`)

  const userData: UserProfileProps = await data.json()

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
      <PostsGridWithInfinteScroll userName={userData.userName} />
    </div>
  )
}
