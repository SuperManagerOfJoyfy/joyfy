'use client'

import { ReactNode, useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Sidebar } from '@/shared/ui/sidebar'
import { LogoutModal } from '@/features/auth/ui'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { Header } from '@/shared/ui/header/Header'
import { Loader } from '@/shared/ui/loader/Loader'
import { createSidebarItems } from '@/shared/utils/sidebarItem/SidebarItem'

import s from '../styles/layout.module.scss'
import { useLogout } from '@/features/auth/hooks/useLogout'

type MainLayoutProps = {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname()
  const { isAuthenticated } = useAuth()
  const { logoutUser, isLoading: isLogoutLoading } = useLogout()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pendingPath, setPendingPath] = useState<string | null>(null)

  const onOpenLogoutModalHandler = (value:boolean) => {
    setIsModalOpen(value)
  }

  const openLogoutModal = () => {
    setIsModalOpen(true)
  }

  const sidebarItems = useMemo(
    () =>
      createSidebarItems('user', {
        openLogoutModal,
      }),
    [openLogoutModal]
  )

  useEffect(() => {
    if (pathname === pendingPath) {
      setPendingPath(null)
    }
  }, [pathname, pendingPath])

  const showLoader = pendingPath && pathname !== pendingPath

  return (
    <div className={s.layoutWrapper}>
      <Header />
      <div className={s.containerLayout}>
        {isAuthenticated && (
          <div className={s.sidebarContainer}>
            <Sidebar
              items={sidebarItems}
              activePath={pendingPath || pathname}
              onItemClick={(item) => {
                if (item.path) setPendingPath(item.path)
              }}
            />
            <LogoutModal
              open={isModalOpen}
              onOpenLogoutModalHandler={onOpenLogoutModalHandler}
              onLogout={logoutUser}
            />
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
