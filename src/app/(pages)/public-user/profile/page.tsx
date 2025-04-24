'use client'

import { Typography } from '@/shared/ui'
import { AuthGuard } from '@/features/auth/ui'

export default function Profile() {
  return (
    <AuthGuard requireAuth>
      <Typography variant="h1">Profile Page</Typography>
    </AuthGuard>
  )
}
