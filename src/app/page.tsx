import { Typography } from '@/shared/ui/typography'
import { Card } from '@/shared/ui/card'

export default function Home() {
  return (
    <div className="container">
      <Card>
        <Typography as="h2" fontWeight="bold">
          Registered users:
        </Typography>
      </Card>
    </div>
  )
}
