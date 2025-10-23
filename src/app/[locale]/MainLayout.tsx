'use client'

import { usePathname, useRouter } from '@/i18n/navigation'
import { useSearchParams } from 'next/navigation'

import { useGetMeQuery } from '@/features/auth/api/authApi'
import { LogoutModal } from '@/features/auth/ui'
import { CreatePost } from '@/features/post/ui'
import { Loader } from '@/shared/ui'
import { createSidebarItems, Header, Sidebar } from '@/widgets'
import { useTranslations } from 'next-intl'
import { ReactNode, useEffect, useMemo, useState } from 'react'

import { useGetChatListQuery } from '@/features/messenger/api'
import s from '../../styles/layout.module.scss'
import { useSelector } from 'react-redux'
import { selectToken } from '@/features/auth/model/authSlice'

type MainLayoutProps = {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = useSelector(selectToken)

  const { data: me, isLoading } = useGetMeQuery()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pendingPath, setPendingPath] = useState<string | null>(null)
  const [isAppInitialized, setIsAppInitialized] = useState(false)

  const onOpenLogoutModalHandler = (value = true) => setIsModalOpen(value)
  const tSidebar = useTranslations('sidebar')

  const { data: chatData } = useGetChatListQuery(
    {},
    {
      skip: !token, // ← don't run while logged out
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  )
  const unreadMessagesCount = chatData?.notReadCount ?? 0

  const sidebarItems = useMemo(
    () =>
      createSidebarItems(
        'user',
        me?.userId,
        {
          onOpenLogoutModalHandler,
          onCreatePost: () => {
            const current = new URLSearchParams(searchParams.toString())
            current.set('action', 'create')
            window.history.pushState(null, '', `?${current.toString()}`)
          },
        },
        tSidebar,
        unreadMessagesCount
      ),
    [onOpenLogoutModalHandler, me?.userId, pathname, router, searchParams, tSidebar, unreadMessagesCount]
  )

  const fullPath = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname
  const showLoader = pendingPath && pathname !== pendingPath
  const hideHeader = pathname.includes('/auth/google')

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
        {!isLoading && me && (
          <div className={s.sidebarContainer}>
            <Sidebar
              items={sidebarItems}
              activePath={pendingPath || fullPath}
              onItemClick={(item) => {
                if (item.path) {
                  router.push(item.path)
                }
              }}
            />
            <LogoutModal open={isModalOpen} onOpenLogoutModalHandler={onOpenLogoutModalHandler} email={me?.email} />
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
