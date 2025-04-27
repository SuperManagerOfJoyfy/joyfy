'use client'

import { ReactNode, useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Sidebar } from '@/shared/ui/sidebar'
import { LogoutModal } from '@/features/auth/ui'
import { Header } from '@/shared/ui/header/Header'
import { Loader } from '@/shared/ui/loader/Loader'
import { createSidebarItems } from '@/shared/utils/sidebarItem/SidebarItem'
import s from '../styles/layout.module.scss'
import { useLogout } from '@/features/auth/hooks/useLogout'
import { useAuth } from '@/features/auth/hooks/useAuth'

type MainLayoutProps = {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname()

  const { user, isAppInitialized } = useAuth()
  const { logoutUser } = useLogout()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pendingPath, setPendingPath] = useState<string | null>(null)

  const onOpenLogoutModalHandler = (value = true) => setIsModalOpen(value)

  const sidebarItems = useMemo(
    () =>
      createSidebarItems('user', user?.userId, {
        onOpenLogoutModalHandler,
      }),
    [onOpenLogoutModalHandler, user?.userId]
  )

  useEffect(() => {
    if (pathname === pendingPath) {
      setPendingPath(null)
    }
  }, [pathname, pendingPath])

  const showLoader = pendingPath && pathname !== pendingPath

  if (!isAppInitialized) {
    return (
      <div className={s.layoutWrapper}>
        <Loader fullScreen />
      </div>
    )
  }

  return (
    <div className={s.layoutWrapper}>
      <Header />
      <div className={s.containerLayout}>
        {user && (
          <div className={s.sidebarContainer}>
            <Sidebar
              items={sidebarItems}
              activePath={pendingPath || pathname}
              onItemClick={(item) => {
                if (item.path) setPendingPath(item.path)
              }}
            />
            <LogoutModal open={isModalOpen} onOpenLogoutModalHandler={onOpenLogoutModalHandler} onLogout={logoutUser} />
          </div>
        )}

        <main className={s.content}>
          {showLoader ? (
            <div className={s.loaderWrapper}>
              <Loader message="Loading..." />
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  )
}
