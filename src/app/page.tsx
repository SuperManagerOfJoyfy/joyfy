'use client'

import { Button, Card, Typography } from '@/shared/ui'
// import { useClear } from '@/features/auth/hooks/useClear'
import { Loader } from '@/shared/ui/loader/Loader'

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
