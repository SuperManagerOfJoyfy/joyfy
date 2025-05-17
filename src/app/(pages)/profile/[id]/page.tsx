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
  const resolvedParams = await params
  const { postId } = (await searchParams) || {}

  const data = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/public-user/profile/${resolvedParams.id}`)
  const userData: PublicUserProfile = await data.json()

  const postData = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/public-posts/${postId}`)
  const post: Post = await postData.json()

  const postsData = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/public-posts/user/${userData.id}?pageSize=8`)
  const posts: GetPostsResponse = await postsData.json()
  console.log(post)

  return (
    <div>
      <UserProfile {...userData} />
      <PostsGridWithInfiniteScroll userId={userData.id} initialPosts={posts} />
      {!!postId && <PostModal initialPost={post} />}
    </div>
  )
}
