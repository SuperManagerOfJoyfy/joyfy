import { AuthGuard } from '@/features/auth/ui'
import { Messenger } from '@/features/messenger/ui'

export default function Page() {
  return (
    <AuthGuard requireAuth>
      <Messenger />
    </AuthGuard>
  )
}
