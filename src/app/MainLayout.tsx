'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { useGetMeQuery } from '@/features/auth/api/authApi'
import { LogoutModal } from '@/features/auth/ui'
import { PATH } from '@/shared/config/routes'
import { createSidebarItems, Header, Sidebar } from '@/widgets'

import s from '../styles/layout.module.scss'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { Loader } from '@/shared/ui'
import { CreatePost } from '@/features/post/ui'

type MainLayoutProps = {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const { data: user, isLoading } = useGetMeQuery()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pendingPath, setPendingPath] = useState<string | null>(null)
  const [isAppInitialized, setIsAppInitialized] = useState(false)

  const onOpenLogoutModalHandler = (value = true) => setIsModalOpen(value)

  const sidebarItems = useMemo(
    () =>
      createSidebarItems('user', user?.userId, {
        onOpenLogoutModalHandler,
        onCreatePost: () => {
          const current = new URLSearchParams(searchParams.toString())
          current.set('action', 'create')
          window.history.pushState(null, '', `?${current.toString()}`)
        },
      }),
    [onOpenLogoutModalHandler, user?.userId, pathname, router, searchParams]
  )

  const fullPath = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname
  const showLoader = pendingPath && pathname !== pendingPath
  const hideHeader = pathname === PATH.AUTH.GOOGLE

  useEffect(() => {
    if (pathname === pendingPath) {
      setPendingPath(null)
    }
  }, [pathname, pendingPath])

  useEffect(() => {
    if (!isLoading) {
      setIsAppInitialized(true)
    }
  }, [isLoading])

  if (!isAppInitialized) {
    return (
      <div className={s.layoutWrapper}>
        <Loader fullScreen />
      </div>
    )
  }

  return (
    <div className={s.layoutWrapper}>
      {!hideHeader && <Header />}
      <div className={s.containerLayout}>
        {!isLoading && user && (
          <div className={s.sidebarContainer}>
            <Sidebar
              items={sidebarItems}
              activePath={pendingPath || fullPath}
              onItemClick={(item) => {
                if (item.path) setPendingPath(item.path)
              }}
            />
            <LogoutModal open={isModalOpen} onOpenLogoutModalHandler={onOpenLogoutModalHandler} email={user?.email} />
          </div>
        )}

        <main className={s.content}>
          {showLoader ? (
            <div className={s.loaderWrapper}>
              <Loader message="Loading..." />
            </div>
          ) : (
            <>
              {children}
              <CreatePost />
            </>
          )}
        </main>
      </div>
    </div>
  )
}
