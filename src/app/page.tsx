import EmailConfirmation from '@/app/(registration-confirmation)/page'
import { Card, Typography } from '@/shared/ui'

type Props = {
  searchParams: {
    code?: string
  }
}
export default function HomePage({ searchParams }: Props) {
  const code = searchParams.code

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
