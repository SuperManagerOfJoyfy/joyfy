'use client'

import { useRouter, usePathname } from 'next/navigation'

import { Sidebar } from '@/shared/ui/sidebar'
import { createSidebarItems } from '@/shared/utils/temp/SidebarItem'
import { Typography, Card, Button } from '@/shared/ui'
import { useClearAllDataMutation } from '@/features/auth/api/authApi'

export default function Home() {
  const pathname = usePathname()
  const router = useRouter()

  const [clearAllData] = useClearAllDataMutation()

  const sidebarItems = createSidebarItems('user', {
    onLogout: () => {
      console.log('onLogout')
    },
  })

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
