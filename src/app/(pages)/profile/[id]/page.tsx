import { UserProfile, UserProfileProps } from '@/features/profile/ui/userProfile'
import { GetPostsResponse } from '@/features/post/api/postsApi.types'
import { PostsGridWithInfiniteScroll } from '@/features/post/ui/postsGridWithInfiniteScroll/PostsGridWithInfiniteScroll'

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params

  const data = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/public-user/profile/${resolvedParams.id}`)

  const userData: UserProfileProps = await data.json()
  const postsData = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/public-posts/user/${userData.id}?pageSize=8`)
  const posts: GetPostsResponse = await postsData.json()

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
      <PostsGridWithInfiniteScroll userId={userData.id} initialPosts={posts} />
    </div>
  )
}
