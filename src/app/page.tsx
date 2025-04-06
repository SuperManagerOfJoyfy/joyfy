'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Sidebar } from '@/shared/ui/sidebar'
import { createSidebarItems } from '@/shared/utils/sidebarItem/SidebarItem'
import { Typography, Card, Button } from '@/shared/ui'
import { useClearAllDataMutation } from '@/features/auth/api/authApi'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { toast } from 'react-toastify'
import { useState } from 'react'
import ClipLoader from 'react-spinners/ClipLoader'

export default function Home() {
  const router = useRouter()
  const pathname = usePathname()
  const [clearAllData] = useClearAllDataMutation()
  const { isAuthenticated, isLoading: authLoading, logoutUser } = useAuth()
  const [isClearing, setIsClearing] = useState(false)

  const sidebarItems = createSidebarItems('user', {
    onLogout: () => {
      console.log('onLogout')
    },
  })

  const handleClear = async () => {
    setIsClearing(true)
    try {
      await clearAllData().unwrap()
      await logoutUser()
      router.push('/auth/login')
    } catch (err) {
      toast.error('Something went wrong')
    } finally {
      setIsClearing(false)
    }
  }

  if (authLoading || isClearing) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <ClipLoader size={50} color="#2563eb" />
      </div>
    )
  }

  return (
    <div style={{ display: 'flex' }}>
      {isAuthenticated && (
        <Sidebar items={sidebarItems} activePath={pathname} />
      )}

      <div>
        <Button onClick={handleClear} disabled={isClearing}>
          Clear All Data
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
