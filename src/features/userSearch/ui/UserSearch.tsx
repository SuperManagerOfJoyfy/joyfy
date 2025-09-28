'use client'

import { useSearchUser } from '@/features/userSearch/utils/hooks/useSearchUser'
import { UsersList } from '@/features/userSearch/ui/usersList/UsersList'
import { PATH } from '@/shared/config/routes'
import { TextField } from '@/shared/ui'
import { useTranslations } from 'next-intl'

export const UserSearch = () => {
  const t = useTranslations('userSearch')

  const { handleChangeValue, handleFetchMore, hasMore, isFetching, searchValue, users } = useSearchUser({
    path: PATH.USER.SEARCH,
  })
  return (
    <div style={{ marginTop: '15px' }}>
      <TextField
        search
        placeholder={t('placeholder')}
        onChange={handleChangeValue}
        value={searchValue}
        isLoading={isFetching}
      />
      <UsersList users={users} isFetching={isFetching} handleFetchMore={handleFetchMore} hasMore={hasMore} />
    </div>
  )
}
