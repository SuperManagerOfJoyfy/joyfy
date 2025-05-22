import { Card, Typography } from '@/shared/ui'
import s from './page.module.scss'
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

    if (!userRes.ok) throw new Error('Failed to fetch user count')
    if (!postsRes.ok) throw new Error('Failed to fetch posts')

    const [userData, postsData] = await Promise.all([userRes.json(), postsRes.json()])

    count = userData.totalCount
    posts = postsData.items ?? []
  } catch (error) {
    console.error(error)
  }

  return (
    <div>
      <Card className={s.card}>
        <Typography as="h2" fontWeight="bold">
          Registered users:
        </Typography>

        <div className={s.countUsersWrapper}>
          {formatNumberToSixDigits(count).map((n, i) => {
            return (
              <Typography key={i} variant="h2" fontWeight="bold" className={s.number}>
                {n}
              </Typography>
            )
          })}
        </div>
      </Card>

      {posts.map((post) => (
        <Typography key={post.id} variant="h1">
          {post.userName}
        </Typography>
      ))}
    </div>
  )
}

function formatNumberToSixDigits(num: number) {
  const formatted = num.toString().padStart(6, '0')
  return [...formatted]
}
