import { Typography, Card } from '@/shared/ui'

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
