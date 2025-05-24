import { UserProfile } from '@/features/profile/ui/userProfile'
import { GetPostsResponse } from '@/features/post/api/postsApi.types'
import { PostsGridWithInfiniteScroll } from '@/features/post/ui/postsGridWithInfiniteScroll/PostsGridWithInfiniteScroll'
import { PostModal } from '@/features/post/ui/postModal'
import { Post } from '@/features/post/types/types'
import { PublicUserProfile } from '@/features/profile/api/profileApi.types'

type PageProps = {
  params: Promise<{ id: string }>
  searchParams?: Promise<{ postId?: number }>
}

export default async function Page({ params, searchParams }: PageProps) {
  const { id } = await params
  const { postId } = (await searchParams) || {}

  const [userRes, postRes, postsRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/public-user/profile/${id}`),
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/public-posts/${postId}`),
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/public-posts/user/${id}?pageSize=8`),
  ])

  const userData: PublicUserProfile = await userRes.json()
  const post: Post = await postRes.json()
  const posts: GetPostsResponse = await postsRes.json()

  return (
    <div>
      <UserProfile {...userData} />
      <PostsGridWithInfiniteScroll userId={userData.id} initialPosts={posts} />
      {!!postId && <PostModal initialPost={post} />}
    </div>
  )
}
