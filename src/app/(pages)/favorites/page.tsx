'use client'

import { AuthGuard } from '@/features/auth/ui'
import { Typography } from '@/shared/ui'

export default function Favorites() {

  return (
    <AuthGuard requireAuth>
      <Typography variant="h1">Favorites Page</Typography>
    </AuthGuard>
  )
}
