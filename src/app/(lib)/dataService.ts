import { GetPostsResponse } from '@/features/post/api/postsApi.types'
import { Post } from '@/features/post/types/types'
import { PublicUserProfile } from '@/features/profile/api/profileApi.types'
import { notFound } from 'next/navigation'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const fetchJSON = async <T>(url: string): Promise<T> => {
  const res = await fetch(url, { next: { revalidate: 60 } })

  if (!res.ok) {
    if (res.status === 404) notFound()
    throw new Error(`Failed to fetch: ${url} (${res.status})`)
  }

  return res.json()
}

export const getUserProfile = (id: string) => fetchJSON<PublicUserProfile>(`${BASE_URL}/public-user/profile/${id}`)

export const getUserPosts = (id: string) =>
  fetchJSON<GetPostsResponse>(`${BASE_URL}/public-posts/user/${id}?pageSize=8`)

export const getPost = (postId: string) => fetchJSON<Post>(`${BASE_URL}/public-posts/${postId}`)
