import { UserProfile } from '@/features/profile/ui/userProfile'
import { PostsGridWithInfiniteScroll } from '@/features/post/ui/postsGridWithInfiniteScroll/PostsGridWithInfiniteScroll'
import { PostModal } from '@/features/post/ui/postModal'
import { PublicUserProfile } from '@/features/profile/api/profileApi.types'
import { Post } from '@/features/post/types/types'
import { GetPostsResponse } from '@/features/post/api/postsApi.types'

type PageProps = {
  params: Promise<{ id: string }>
  searchParams?: Promise<{ postId?: number }>
}

export default async function Page({ params, searchParams }: PageProps) {
  const { id } = await params
  const { postId } = (await searchParams) || {}

  let userData: PublicUserProfile | null = null
  let post: Post | null = null
  let posts: GetPostsResponse | null = null

  try {
    const [userRes, postRes, postsRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/public-user/profile/${id}`),
      postId
        ? fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/public-posts/${postId}`)
        : Promise.resolve({ ok: true, json: async () => null }),
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/public-posts/user/${id}?pageSize=8`),
    ])

    if (!userRes.ok) console.error('Failed to fetch user profile.')
    if (postId && !postRes.ok) console.error('Failed to fetch post.')
    if (!postsRes.ok) console.error('Failed to fetch user posts.')

    userData = await userRes.json()
    post = postId ? await postRes.json() : null
    posts = await postsRes.json()
  } catch (error) {
    console.error('Data loading error:', error)
    return <div>Error loading data. Please try again later.</div>
  }

  if (!userData || !posts) {
    return <div>Unable to load profile or posts.</div>
  }

  return (
    <div>
      <UserProfile {...userData} />
      <PostsGridWithInfiniteScroll userId={userData.id} initialPosts={posts} />
      {!!postId && <PostModal initialPost={post} />}
    </div>
  )
}
