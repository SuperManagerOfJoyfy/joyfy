import { getUserPosts, getUserProfile } from '@/app/(lib)/dataService'
import { PostsGridWithInfiniteScroll } from '@/features/post/ui/postsGridWithInfiniteScroll/PostsGridWithInfiniteScroll'
import { UserProfile } from '@/features/profile/ui/userProfile'

type PageProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const { userName } = await getUserProfile(id)

  return { title: `Joyfy: ${userName}` }
}

export default async function ProfilePage({ params }: PageProps) {
  const { id } = await params

  const [userData, posts] = await Promise.all([getUserProfile(id), getUserPosts(id)])

  return (
    <div>
      <UserProfile {...userData} />
      <PostsGridWithInfiniteScroll userId={userData.id} initialPosts={posts} />
    </div>
  )
}
