import { Typography } from '@/shared/ui'
import { AuthGuard } from '@/features/auth/ui'
import { UserSearch } from '@/features/userSearch/ui'
import { useTranslations } from 'next-intl'

export default function Search() {
  const t = useTranslations('userSearch')

  return (
    <AuthGuard requireAuth>
      <Typography variant="h1">{t('placeholder')}</Typography>
      <UserSearch />
    </AuthGuard>
  )
}
