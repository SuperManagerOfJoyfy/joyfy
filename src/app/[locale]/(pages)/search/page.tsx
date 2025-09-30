import { Typography } from '@/shared/ui'
import { AuthGuard } from '@/features/auth/ui'
import { UserSearch } from '@/features/userSearch/ui'
import { getTranslations, setRequestLocale } from 'next-intl/server'

type Props = {
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ru' }]
}

export default async function Search({ params }: Props) {
  const { locale } = await params

  setRequestLocale(locale)

  const t = await getTranslations('userSearch')

  return (
    <AuthGuard requireAuth>
      <Typography variant="h1">{t('title')}</Typography>
      <UserSearch />
    </AuthGuard>
  )
}
