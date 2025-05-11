import { UserProfile, UserProfileProps } from '@/features/profile/ui/userProfile'
import { PostsGridWithInfinteScroll } from '@/features/post/ui/postsGridWithInfiniteScroll/PostsGridWithInfinteScroll'
import { CreatePost } from '@/features/post/ui'

type PageProps = {
  params: { id: string }
  searchParams?: { action?: string }
}

export default async function Page({ params, searchParams }: PageProps) {
  const { id } = params
  const { action } = searchParams || {}

  const data = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/public-user/profile/${id}`)
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
      <PostsGridWithInfinteScroll />

      <CreatePost showCreateModal={action === 'create'} user={userData} />
    </div>
  )
}
