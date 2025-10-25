import { store } from '@/app/store/store'
import { postsApi } from '@/features/post/api'
import { GetPostsResponse } from '@/features/post/api/postsApi.types'
import { PostsGridWithInfiniteScroll } from '@/features/post/ui/postsGridWithInfiniteScroll'
import { PostModal } from '@/features/postModal/ui'

import { PublicUserProfile } from '@/features/profile/api/profileApi.types'
import { UserProfile } from '@/features/profile/ui/userProfile'

type PageProps = {
  params: Promise<{ id: string }>
  searchParams?: Promise<{ postId?: number }>
}

export default async function Page({ params, searchParams }: PageProps) {
  const { id } = await params
  const { postId } = (await searchParams) || {}

  let post = null

  if (postId) {
    const postRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/public-posts/${postId}`)
    post = await postRes.json()
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
      {!!postId && <PostModal userProfile={{ userId: userData.id, userName: userData.userName }} initialPost={post} />}
    </div>
  )
}
