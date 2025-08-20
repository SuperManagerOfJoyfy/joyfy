'use client'
import { useLazySearchUserByNameQuery } from '@/features/userSearch/api/usersApi'
import { UsersList } from '@/features/userSearch/ui/UsersList'
import { PATH } from '@/shared/config/routes'
import { useDebounce } from '@/shared/hooks'
import { TextField } from '@/shared/ui'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'

export const UserSearch = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialSearch = searchParams.get('search') ?? ''
  const [search, setSearch] = useState(initialSearch)
  const [searchUser, { data, isFetching }] = useLazySearchUserByNameQuery()
  const users = data ? data?.items : []

  useEffect(() => {
    if (initialSearch) {
      searchUser({ search: initialSearch, cursor: 0 })
    }
  }, [initialSearch, searchUser])

  const debouncedSearhByName = useDebounce((value: string) => {
    searchUser({ search: value, cursor: 0 })

    router.replace(value ? `${PATH.USER.SEARCH}?search=${encodeURI(value)}` : `${PATH.USER.SEARCH}`)
  }, 300)

  const hasMore = data ? users.length < data.totalCount : false

  const handleFetchMore = useCallback(async () => {
    if (isFetching) return

    const lastId = users.at(-1)?.id

    if (lastId) {
      try {
        await searchUser({ search, cursor: lastId }).unwrap()
      } catch (err) {
        console.error('Error loading more users:', err)
      }
    }
  }, [users, searchUser])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value)
    debouncedSearhByName(e.currentTarget.value)
  }

  return (
    <div style={{ marginTop: '15px' }}>
      <TextField search placeholder="Search" onChange={handleChange} value={search} isLoading={isFetching} />
      <UsersList users={users} isFetching={isFetching} handleFetchMore={handleFetchMore} hasMore={hasMore} />
    </div>
  )
}
