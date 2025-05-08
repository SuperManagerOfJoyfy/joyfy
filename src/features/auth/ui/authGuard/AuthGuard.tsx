'use client'

import { ReactNode, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader } from '@/shared/ui/loader/Loader'
import { PATH } from '@/shared/config/routes'
import s from './authGuard.module.scss'
import { useGetMeQuery } from '@/features/auth/api/authApi'

type AuthGuardProps = {
  children: ReactNode
  requireAuth?: boolean
  redirectPath?: string
}

export const AuthGuard = ({
  children,
  requireAuth = false,
  redirectPath = requireAuth ? PATH.AUTH.LOGIN : PATH.ROOT,
}: AuthGuardProps) => {
  const { data: user, isLoading } = useGetMeQuery()
  const router = useRouter()

  const shouldRedirect = useMemo(() => {
    if (isLoading) return false
    return requireAuth ? !user : !!user
  }, [user, isLoading, requireAuth])

  useEffect(() => {
    if (shouldRedirect) {
      router.push(redirectPath)
    }
  }, [shouldRedirect, redirectPath, router])

  if (isLoading) {
    return (
      <div className={s.loadingContainer} role="status" aria-busy="true">
        <Loader />
      </div>
    )
  }

  if (shouldRedirect) {
    return null
  }

  return <>{children}</>
}
