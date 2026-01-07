import { PublicPosts } from '@/features/main/ui/publicPosts/PublicPosts'
import { Post } from '@/features/post/types/postTypes'
import { setRequestLocale } from 'next-intl/server'
import { AuthActionHandler } from '@/features/auth/ui/authActionHandler/AuthActionHandler'

type PageProps = {
  searchParams: Promise<{ code?: string; email?: string }>
  params: Promise<{ locale: string }>
}

export const revalidate = 60

export default async function HomePage({ searchParams, params }: PageProps) {
  const { locale } = await params
  const searchParam = await searchParams
  const code = searchParam?.code
  const email = searchParam?.email

  setRequestLocale(locale)

  if (code) {
    return <AuthActionHandler code={code} email={email} locale={locale} />
  }

  let count = 0
  let posts: Post[] = []

  try {
    const [userRes, postsRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/public-user`),
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/public-posts/all?pageSize=4`),
    ])

    if (!userRes.ok) console.error('Failed to fetch user count')
    if (!postsRes.ok) console.error('Failed to fetch posts')

    const [userData, postsData] = await Promise.all([userRes.json(), postsRes.json()])

    count = userData.totalCount
    posts = postsData.items ?? []
  } catch (error) {
    console.error(error)
  }

  return <PublicPosts count={count} posts={posts} />
}
