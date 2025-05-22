import { Card, Typography } from '@/shared/ui'
import s from './page.module.scss'

export const revalidate = 60

export default async function HomePage() {
  let count = 0

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/public-user`, {
      next: { revalidate: 60 },
    })

    if (!res.ok) throw new Error('Failed to fetch user count')
    const data = await res.json()
    count = data.totalCount
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
    </div>
  )
}

function formatNumberToSixDigits(num: number) {
  const formatted = num.toString().padStart(6, '0')
  return [...formatted]
}
