'use client'

import { usePathname } from 'next/navigation'
import { Sidebar } from '@/shared/ui/sidebar'
import { Button, Card, Typography } from '@/shared/ui'
import { useLogout } from '@/shared/hooks/useLogout'
import { LogoutModal } from '@/features/auth/ui/logout/LogoutModal'

export default function Home() {
  const pathname = usePathname()

  const {
    isModalOpen,
    sidebarItems,
    handleClearData,
    handleOpenChange,
    onLogoutHandler
  } = useLogout()

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar items={sidebarItems} activePath={pathname}  />
      <LogoutModal open={isModalOpen} onOpenChange={handleOpenChange} onConfirm={onLogoutHandler}/>
      <Button onClick={handleClearData}>Clear All Data</Button>
      <div>
        <Card>
          <Typography as="h2" fontWeight="bold">
            Registered users:
          </Typography>
        </Card>
      </div>
    </div>
  )
}
