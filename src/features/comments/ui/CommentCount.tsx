'use client'

import { useGetCommentsQuery } from '@/features/comments/api/commentsApi'
import { ReactNode } from 'react'

type Props = {
  postId: number
  children?: (args: { totalCount: number; isFetching: boolean }) => ReactNode
}

export const CommentCount = ({ postId, children }: Props) => {
  const { totalCount, isFetching } = useGetCommentsQuery(
    {
      postId,
      pageSize: 1,
      pageNumber: 1,
      sortBy: 'createdAt',
      sortDirection: 'desc',
    },
    {
      skip: !postId,
      selectFromResult: ({ data, isFetching }) => ({
        totalCount: data?.totalCount ?? 0,
        isFetching,
      }),
    }
  )

  if (children) {
    return <>{children({ totalCount, isFetching })}</>
  }

  // default inline rendering
  return <span>{isFetching ? '…' : totalCount}</span>
}
