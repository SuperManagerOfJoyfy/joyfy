'use client'

import { Card, Typography } from '@/shared/ui'

export default function HomePage() {
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
