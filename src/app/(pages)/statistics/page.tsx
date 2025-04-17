'use client'

import { Typography } from '@/shared/ui'
import { AuthGuard } from '@/features/auth/ui'

export default function Statistics() {

  return (
       <AuthGuard requireAuth>
      <Typography variant="h1">Statistics Page</Typography>
    </AuthGuard>
  )
}
