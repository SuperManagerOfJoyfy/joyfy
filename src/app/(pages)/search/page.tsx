'use client'

import { Typography } from '@/shared/ui'
import { AuthGuard } from '@/features/auth/ui'

export default function Search() {
  return (
    <AuthGuard requireAuth>
      <Typography variant="h1">Search Page</Typography>
    </AuthGuard>
  )
}
