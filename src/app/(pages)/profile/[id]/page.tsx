import { UserProfile, UserProfileProps } from '@/features/profile/ui/userProfile'
import { PostsGridWithInfiniteScroll } from '@/features/post/ui/postsGridWithInfiniteScroll/PostsGridWithInfiniteScroll'
import { CreatePost } from '@/features/post/ui'
import { PostModal } from '@/features/post/ui/postModal'
import { Post } from '@/features/post/types/types'

type PageProps = {
  params: Promise<{ id: string }>
  searchParams?: Promise<{ action?: string; postId?: number }>
}

export default async function Page({ params, searchParams }: PageProps) {
  const resolvedParams = await params
  const { action, postId } = (await searchParams) || {}

  const data = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/public-user/profile/${resolvedParams.id}`)
  const post = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/public-posts/${postId}`)
  const userData: UserProfileProps = await data.json()
  const postData: Post = await post.json()
  console.log(postData)

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
      <PostsGridWithInfiniteScroll userName={userData.userName} />
      {!!postId && <PostModal post={postData} />}
      <CreatePost showCreateModal={action === 'create'} user={userData} />
    </div>
  )
}
