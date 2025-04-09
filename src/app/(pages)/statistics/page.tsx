'use client'

import { Typography } from '@/shared/ui'
import { Loader } from '@/shared/ui/loader/Loader'
import { useAuth } from '@/features/auth/hooks/useAuth'

export default function Statistics() {
  const { isLoading } = useAuth()

  if (isLoading) {
    return <Loader message="Loading..." />
  }

  return (
    <div style={{ padding: '2rem' }}>
      <Typography variant="h1">Statistics Page</Typography>
    </div>
  )
}
