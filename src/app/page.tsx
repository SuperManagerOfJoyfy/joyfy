import { PublicPosts } from '@/features/main/ui/publicPosts/PublicPosts'
import { Post } from '@/features/post/types/types'

export const revalidate = 60

export default async function HomePage() {
  let count = 0
  let posts: Post[] = []

  try {
    const [userRes, postsRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/public-user`, {
        next: { revalidate: 60 },
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/public-posts/all?pageSize=4`, {
        next: { revalidate: 60 },
      }),
    ])

    if (!userRes.ok) {
      console.error('Failed to fetch user count')
    } else if (!postsRes.ok) {
      console.error('Failed to fetch posts')
    } else {
      const [userData, postsData] = await Promise.all([userRes.json(), postsRes.json()])
      count = userData.totalCount
      posts = postsData.items ?? []
    }
  } catch (error) {
    console.error(error)
  }

  return <PublicPosts count={count} posts={posts} />
}
