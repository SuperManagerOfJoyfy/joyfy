import { useAppDispatch } from '@/app/store/store'
import { useLazySearchUserByNameQuery, usersApi } from '@/features/userSearch/api/usersApi'
import { useDebounce } from '@/shared/hooks'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'

export const useSearchUser = ({ path }: { path: string }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialSearch = searchParams.get('search') ?? ''
  const [searchValue, setSearchValue] = useState(initialSearch)
  const [searchUser, { data, isFetching }] = useLazySearchUserByNameQuery()
  const users = data ? data?.items : []
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (initialSearch) {
      searchUser({ search: initialSearch, cursor: 0 })
    }
  }, [initialSearch, searchUser])

  const debouncedSearhByName = useDebounce((value: string) => {
    console.log('search', searchValue)
    if (value.trim() !== '') {
      searchUser({ search: value, cursor: 0 })
      router.replace(value ? `${path}?search=${encodeURI(value)}` : `${path}`)
    }
  }, 300)

  const hasMore = data ? users.length < data.totalCount : false

  const handleFetchMore = useCallback(async () => {
    if (isFetching) return

    const lastId = users.at(-1)?.id

    if (lastId) {
      try {
        await searchUser({ search: searchValue, cursor: lastId }).unwrap()
      } catch (err) {
        console.error('Error loading more users:', err)
      }
    }
  }, [users, searchUser])

  const handleChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.currentTarget.value)
    debouncedSearhByName(e.currentTarget.value)
  }

  return { searchValue, users, handleChangeValue, isFetching, hasMore, handleFetchMore }
}
