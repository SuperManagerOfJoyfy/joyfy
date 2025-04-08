'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Sidebar } from '@/shared/ui/sidebar'
import { createSidebarItems } from '@/shared/utils/sidebarItem/SidebarItem'
import { Button, Card, Typography } from '@/shared/ui'
import { useClearAllDataMutation } from '@/features/auth/api/authApi'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { toast } from 'react-toastify'
import { useState } from 'react'
import { Loader } from '@/shared/ui/loader/Loader'
import { LogoutModal } from '@/features/auth/ui/logout/LogoutModal'
import { PATH } from '@/shared/config/routes'

export default function Home() {
  const router = useRouter()
  const pathname = usePathname()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [clearAllData] = useClearAllDataMutation()
  const { isAuthenticated, isLoading: authLoading, logoutUser } = useAuth()
  const [isClearing, setIsClearing] = useState(false)

  const onLogoutModalOpenChangeHandler = (isOpen: boolean) => {
    setIsModalOpen(isOpen)
  }
  const sidebarItems = createSidebarItems('user', {
    onLogout: () => {},
  })

  const handleClear = async () => {
    setIsClearing(true)
    try {
      await clearAllData().unwrap()
      await logoutUser()
      router.push(PATH.AUTH.LOGIN)
      toast.success('All data has been cleared')
    } catch (err) {
      toast.error('Failed to clear data')
    } finally {
      setIsClearing(false)
    }
  }

  if (authLoading || isClearing) {
    return <Loader />
  }
  return (
    <div style={{ display: 'flex' }}>
      {isAuthenticated && (
        <>
          <Sidebar items={sidebarItems} activePath={pathname} />
          <LogoutModal
            open={isModalOpen}
            onOpenChange={onLogoutModalOpenChangeHandler}
            onLogout={logoutUser}
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
