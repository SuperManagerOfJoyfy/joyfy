'use client'

import { usePathname } from 'next/navigation'
import { Sidebar } from '@/shared/ui/sidebar'
import { createSidebarItems } from '@/shared/utils/sidebarItem/SidebarItem'
import { Button, Card, Typography } from '@/shared/ui'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useState } from 'react'
import { Loader } from '@/shared/ui/loader/Loader'
import { LogoutModal } from '@/features/auth/ui'
import { useClear } from '@/features/auth/hooks/useClear'

export default function Home() {
  const pathname = usePathname()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const { isClearing, handleClear } = useClear()
  const { isAuthenticated, isLoading: authLoading, logoutUser } = useAuth()

  const handleLogout = async () => {}

  const onLogoutModalOpenChangeHandler = (isOpen: boolean) => {
    setIsModalOpen(isOpen)
  }

  const sidebarItems = createSidebarItems('user', {
    onLogout: () => setIsModalOpen(true),
  })

  if (authLoading || isClearing) {
    return <Loader message="Processing..." />
  }

  return (
    <div style={{ display: 'flex' }}>
      {isAuthenticated && (
        <>
          <Sidebar items={sidebarItems} activePath={pathname} />
          <LogoutModal
            open={isModalOpen}
            onOpenChange={onLogoutModalOpenChangeHandler}
            onLogout={handleLogout}
          />
        </>
      )}

      <div>
        <Button onClick={handleClear} disabled={isClearing}>
          {isClearing ? 'Clearing...' : 'Clear All Data'}
        </Button>
        <Card>
          <Typography as="h2" fontWeight="bold">
            Registered users:
          </Typography>
        </Card>
      </div>
    </div>
  )
}
