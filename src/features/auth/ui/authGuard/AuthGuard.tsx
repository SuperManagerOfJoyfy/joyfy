'use client'

import { ReactNode, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'

import { useAuth } from '../../hooks/useAuth'
import { Loader } from '@/shared/ui/loader/Loader'
import { PATH } from '@/shared/config/routes'
import s from './authGuard.module.scss'

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
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  const shouldRedirect = useMemo(() => {
    if (isLoading) return false
    return requireAuth ? !isAuthenticated : isAuthenticated
  }, [isAuthenticated, isLoading, requireAuth])

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
