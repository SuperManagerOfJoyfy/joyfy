import { AuthGuard } from '@/features/auth/ui'
import { Typography } from '@/shared/ui'
import s from './MessengerPage.module.scss'

export default function Page() {
  return (
    <AuthGuard requireAuth>
      <div className={s.container}>
        <p className={s.banner}>Choose who you would like to talk to</p>
      </div>
    </AuthGuard>
  )
}
