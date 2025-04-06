'use client'

import { usePathname, useRouter } from 'next/navigation'

import { Sidebar } from '@/shared/ui/sidebar'
import { createSidebarItems } from '@/shared/utils/SidebarItem/SidebarItem'
import { Button, Card, Modal, Typography } from '@/shared/ui'
import {
  useClearAllDataMutation,
  useLogoutMutation,
} from '@/features/auth/api/authApi'
import { useState } from 'react'

export default function Home() {
  const pathname = usePathname()
  const router = useRouter()

  const [clearAllData] = useClearAllDataMutation()
  const [onLogout] = useLogoutMutation()

  let [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenChange = (isOpen: boolean) => {
    setIsModalOpen(isOpen)
  }

  const sidebarItems = createSidebarItems('user', {
    onLogout: () => {
      handleOpenChange(true)
    },
  })

  const onLogoutHandler = async () => {
    try {
      await onLogout({}).unwrap()
      router.push('/auth/login')
    } catch (error) {
      console.log('Failed to logout:', error)
    }
  }

  const handleClearData = async () => {
    try {
      await clearAllData({}).unwrap()
      console.log('All data cleared successfully')
      router.push('/auth/login')
    } catch (error) {
      console.error('Failed to clear data:', error)
    }
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar items={sidebarItems} activePath={pathname} />
      <Modal open={isModalOpen} title="Logout" onOpenChange={handleOpenChange}>
        <div style={{ padding: '30px 0 12px' }}>
          <Typography variant="body1" style={{ marginBottom: '18px' }}>
            Are you really want to log out of your account?
          </Typography>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              style={{ margin: '10px' }}
              onClick={() => {
                setIsModalOpen(false)
              }}
            >
              No
            </Button>
            <Button style={{ margin: '10px' }} onClick={onLogoutHandler}>
              Yes
            </Button>
          </div>
        </div>
      </Modal>
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
