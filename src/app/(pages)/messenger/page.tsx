'use client'

import { AuthGuard } from '@/features/auth/ui'
import { Typography } from '@/shared/ui'

export default function Messenger() {

  return (
    <AuthGuard requireAuth>
      <Typography variant="h1">Messenger Page</Typography>
    </AuthGuard>
  )
}
