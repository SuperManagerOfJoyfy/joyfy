'use client'

import { Typography } from '@/shared/ui'
import { AuthGuard } from '@/features/auth/ui'

export default function Settings() {
  return (
    <AuthGuard requireAuth>
      <Typography variant="h1">Settings Page</Typography>
    </AuthGuard>
  )
}
