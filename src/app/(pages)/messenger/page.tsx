'use client'

import { Typography } from '@/shared/ui'
import { Loader } from '@/shared/ui/loader/Loader'
import { useAuth } from '@/features/auth/hooks/useAuth'

export default function Messenger() {
  const { isLoading } = useAuth()

  if (isLoading) {
    return <Loader message="Loading..." />
  }

  return (
    <div style={{ padding: '2rem' }}>
      <Typography variant="h1">Messenger Page</Typography>
    </div>
  )
}
