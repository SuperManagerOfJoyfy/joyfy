'use client'

import { usePathname, useRouter } from '@/i18n/navigation'
import { useSearchParams } from 'next/navigation'

import { useGetMeQuery } from '@/features/auth/api/authApi'
import { LogoutModal } from '@/features/auth/ui'
import { CreatePost } from '@/features/post/ui'
import { Loader } from '@/shared/ui'
import { createSidebarItems, Header, Sidebar, SidebarItem } from '@/widgets'
import { useTranslations } from 'next-intl'
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'

import s from '../../styles/layout.module.scss'
import { useGetChatListQuery } from '@/features/messenger/api'

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
  const tSidebar = useTranslations('sidebar')

  const onOpenLogoutModalHandler = useCallback((value = true) => {
    setIsModalOpen(value)
  }, [])

  const onCreatePost = useCallback(() => {
    const current = new URLSearchParams(searchParams.toString())
    current.set('action', 'create')
    window.history.pushState(null, '', `?${current.toString()}`)
  }, [searchParams])

  const sidebarActions = useMemo(
    () => ({
      onOpenLogoutModalHandler,
      onCreatePost,
    }),
    [onOpenLogoutModalHandler, onCreatePost]
  )

  const handleItemClick = useCallback(
    (item: SidebarItem) => {
      if (item.path) {
        router.push(item.path)
      }
    },
    [router]
  )

  const { data: chatData } = useGetChatListQuery({})
  const unreadMessagesCount = chatData?.notReadCount

  const sidebarItems = useMemo(
    () => createSidebarItems('user', user?.userId, sidebarActions, tSidebar, unreadMessagesCount),
    [user?.userId, sidebarActions, unreadMessagesCount]
  )

  const showLoader = pendingPath && pathname !== pendingPath
  const hideHeader = pathname.includes('/auth/google')

  const activePath = useMemo(() => {
    if (pendingPath) return pendingPath
    return searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname
  }, [pathname, searchParams, pendingPath])

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
            <Sidebar items={sidebarItems} activePath={activePath} onItemClick={handleItemClick} />
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
