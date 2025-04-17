'use client'

import { Typography } from '@/shared/ui'
import { AuthGuard } from '@/features/auth/ui'

export default function Create() {
  return (
    <AuthGuard requireAuth>
      <Typography variant="h1">Create Page</Typography>
    </AuthGuard>
  )
}
