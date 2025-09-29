import { Typography } from '@/shared/ui'
import { AuthGuard } from '@/features/auth/ui'
import { UserSearch } from '@/features/userSearch/ui'
import { getTranslations } from 'next-intl/server'

export default async function Search() {
  const t = await getTranslations('userSearch')
  return (
    <AuthGuard requireAuth>
      <Typography variant="h1">{t('placeholder')}</Typography>
      <UserSearch />
    </AuthGuard>
  )
}
