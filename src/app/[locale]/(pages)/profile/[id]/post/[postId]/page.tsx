import { GetPostsResponse } from '@/features/post/api'
import { PostsGridWithInfiniteScroll } from '@/features/post/ui/postsGridWithInfiniteScroll'
import { PostModal } from '@/features/postModal/ui'
import { PublicUserProfile } from '@/features/profile/api'
import { UserProfile } from '@/features/profile/ui/userProfile'

type PageProps = {
  params: Promise<{ id: string; postId: string }>
  searchParams?: Promise<{ postId?: number }>
}

// THIS PAGE IS USED ONLY FOR DIRECT VISITS and URL NAVIGATION (SSR for SEO)

export default async function Page({ params }: PageProps) {
  const { id, postId } = await params

  let serverPost = null

  if (postId) {
    const postRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/public-posts/${postId}`)
    serverPost = await postRes.json()
  }

  const [userRes, postsRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/public-user/profile/${id}`),
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/public-posts/user/${id}?pageSize=8`),
  ])

  const userData: PublicUserProfile = await userRes.json()

  const posts: GetPostsResponse = await postsRes.json()

  return (
    <div>
      <UserProfile {...userData} />
      <PostsGridWithInfiniteScroll userId={userData.id} initialPostsData={posts} />
      {!!postId && (
        <PostModal
          userProfile={{ userId: userData.id, userName: userData.userName }}
          initialPost={serverPost}
          isIntercepted={false}
          postId={Number(postId)}
        />
      )}
    </div>
  )
}
