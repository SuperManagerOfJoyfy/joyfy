import { AuthGuard } from '@/features/auth/ui'
import { UserSearch } from '@/features/userSearch/ui'
import { Typography } from '@/shared/ui'
import { getTranslations, setRequestLocale } from 'next-intl/server'

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Search({ params, searchParams }: Props) {
  const { locale } = await params
  await searchParams

  setRequestLocale(locale)

  const t = await getTranslations('userSearch')

  return (
    <AuthGuard requireAuth>
      <Typography variant="h1">{t('title')}</Typography>
      <UserSearch />
    </AuthGuard>
  )
}
