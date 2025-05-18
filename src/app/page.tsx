import EmailConfirmation from '@/app/(registration-confirmation)/page'
import { Card, Typography } from '@/shared/ui'

type Props = {
  searchParams: {
    code?: string
  }
}
export default async function HomePage({ searchParams }: Props) {
  const { code } = await searchParams

  if (code) {
    return <EmailConfirmation code={code} />
  }

  return (
    <div>
      <Card>
        <Typography as="h2" fontWeight="bold">
          Registered users:
        </Typography>
      </Card>
    </div>
  )
}
