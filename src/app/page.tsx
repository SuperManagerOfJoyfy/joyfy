'use client'

import { Button, Card, Typography } from '@/shared/ui'
import { useClear } from '@/features/auth/hooks/useClear'
import { Loader } from '@/shared/ui/loader/Loader'

export default function HomePage() {
  const { isClearing, handleClear } = useClear()

  if (isClearing) return <Loader message="Clearing data..." />

  return (
    <div>
      <Button onClick={handleClear} disabled={isClearing}>
        {isClearing ? 'Clearing...' : 'Clear All Data'}
      </Button>

      <Card>
        <Typography as="h2" fontWeight="bold">
          Registered users:
        </Typography>
      </Card>
    </div>
  )
}
