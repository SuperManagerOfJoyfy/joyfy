import { useState } from 'react'
import { toast } from 'react-toastify'
import { useClearAllDataMutation } from '@/features/auth/api/authApi'

export const useClear= () => {
  const [isClearing, setIsClearing] = useState(false)
  const [clearAllData] = useClearAllDataMutation()

  const handleClear = async () => {
    setIsClearing(true)
    try {
      await clearAllData().unwrap()
      toast.success('All data has been cleared')
    } catch {
      toast.error('Failed to clear data')
    } finally {
      setIsClearing(false)
    }
  }

  return { isClearing, handleClear }
}
