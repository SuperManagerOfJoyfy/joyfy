'use client'

import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { Typography } from '@/shared/ui'

import { useAuth } from '../../hooks/useAuth'
import { Loader } from '@/shared/ui/loader/Loader'
import s from './authGuard.module.scss'

type AuthGuardProps = {
  children: ReactNode
  requireAuth?: boolean
  redirectPath?: string
}

export const AuthGuard = ({
  children,
  requireAuth = false,
  redirectPath = requireAuth ? '/login' : '/',
}: AuthGuardProps) => {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (
        (requireAuth && !isAuthenticated) ||
        (!requireAuth && isAuthenticated)
      ) {
        router.push(redirectPath)
      }
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectPath, router])

  if (isLoading) {
    return (
      <div className={s.loadingContainer} role="status" aria-busy="true">
        <Loader />
        <Typography className={s.loadingText}>Loading...</Typography>
      </div>
    )
  }

  if ((requireAuth && !isAuthenticated) || (!requireAuth && isAuthenticated)) {
    return null
  }

  return <>{children}</>
}
