import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  useClearAllDataMutation,
  useLogoutMutation,
} from '@/features/auth/api/authApi'
import { createSidebarItems } from '@/shared/utils/SidebarItem/SidebarItem'

export const useLogout = () => {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [onLogout] = useLogoutMutation()
  const [clearAllData] = useClearAllDataMutation()

  const handleOpenChange = (isOpen: boolean) => {
    setIsModalOpen(isOpen)
  }

  const onLogoutHandler = async () => {
    try {
      await onLogout().unwrap()
      router.push('/auth/login')
    } catch (error) {
      console.log('Failed to logout:', error)
    }
  }

  const sidebarItems = createSidebarItems('user', {
    onLogout: () => {
      handleOpenChange(!isModalOpen)
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

  return {
    isModalOpen,
    handleOpenChange,
    onLogoutHandler,
    sidebarItems,
    setIsModalOpen,
    handleClearData,
  }
}
