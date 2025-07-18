'use client'

import s from '@/features/profile/ui/devices/Devices.module.scss'
import { FaChrome } from 'react-icons/fa'
import { Button, Card, Typography } from '@/shared/ui'
import { DeviceInfo } from '@/features/profile/api/devicesApi.types'
import { FiLogOut } from 'react-icons/fi'
import React from 'react'
import { MdLaptopWindows, MdOutlineDesktopMac, MdOutlinePhoneAndroid, MdOutlinePhoneIphone } from 'react-icons/md'
import { useLogOutMutation } from '@/features/profile/api/devicesApi'
import { toast } from 'react-toastify'
import { useLogoutMutation } from '@/features/auth/api/authApi'

type DeviceInfoCardProps = Pick<DeviceInfo, 'deviceId' | 'ip' | 'lastActive' | 'osName'> & { currentDeviceId: number }

const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0') // месяцы с 0
  const year = date.getFullYear()
  return `${day}.${month}.${year}`
}

const iconMap: Record<string, React.ElementType> = {
  'Mac OS': MdOutlineDesktopMac,
  iOS: MdOutlinePhoneIphone,
  Windows: MdLaptopWindows,
  Android: MdOutlinePhoneAndroid,
}

export const DeviceInfoCard = ({ deviceId, ip, lastActive, osName, currentDeviceId }: DeviceInfoCardProps) => {
  const [logOut, { isLoading }] = useLogOutMutation()
  const [logout] = useLogoutMutation()

  const Icon = iconMap[osName] ?? FaChrome

  const onLogOutButtonClickHandler = async (deviceId: number) => {
    try {
      if (deviceId === currentDeviceId) {
        try {
          await logout().unwrap()
        } catch (error: any) {
          toast.error(error)
        }
      } else {
        await logOut(deviceId).unwrap()
        toast.success('Successfully logged out from sessionId: ' + deviceId)
      }
    } catch (error: any) {
      toast.error(error)
    }
  }

  return (
    <Card className={s.card}>
      <div className={s.deviceInfo}>
        <div>
          <Icon className={s.deviceIcon} />
        </div>
        <div>
          <Typography className={s.osName} variant="h3">
            {osName}
          </Typography>
          <Typography className={s.label} variant="caption">
            IP: {ip}
          </Typography>
          <Typography className={s.label} variant="caption">
            Last visit: {formatDate(lastActive)}
          </Typography>
        </div>
        <div className={s.logOutButtonBlock}>
          <Button
            variant={'icon'}
            className={s.logOutButton}
            onClick={() => onLogOutButtonClickHandler(deviceId)}
            disabled={isLoading}
          >
            <FiLogOut className={s.logOutIcon} /> Log Out
          </Button>
        </div>
      </div>
    </Card>
  )
}
