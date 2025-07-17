'use client'

import { Button, Card, Typography } from '@/shared/ui'
import s from './Devices.module.scss'
import { useGetSessionsQuery, useTerminateAllOtherSessionsMutation } from '@/features/profile/api/devicesApi'
import { FaChrome } from 'react-icons/fa'
import { DeviceInfoCard } from '@/features/profile/ui/devices/DeviceInfoCard'
import { toast } from 'react-toastify'

export const Devices = () => {
  const { data: devices } = useGetSessionsQuery()
  const [terminateAllOtherSessions, { isLoading }] = useTerminateAllOtherSessionsMutation()

  const onTerminateAllOtherSessionsButtonClickHandler = async () => {
    try {
      await terminateAllOtherSessions().unwrap()
      toast.success('Successfully terminated from all other sessions')
    } catch (error: any) {
      toast.error(error)
    }
  }

  return (
    <div>
      <div>
        <Typography className={s.title} variant="h3">
          Current device
        </Typography>

        <Card className={s.card}>
          <div className={s.deviceInfo}>
            <FaChrome className={s.deviceIcon} />
            <div>
              <Typography className={s.browserName} variant="h3">
                {devices?.current.browserName}
              </Typography>
              <Typography className={s.label} variant="caption">
                IP: {devices?.current.ip}
              </Typography>
            </div>
          </div>
        </Card>
      </div>
      <div className={s.terminateButtonContainer}>
        <Button variant="outline" onClick={onTerminateAllOtherSessionsButtonClickHandler} disabled={isLoading}>
          Terminate all other session
        </Button>
      </div>
      <div>
        <Typography className={s.title} variant="h3">
          Active sessions
        </Typography>
        {devices?.others.map(({ ip, deviceId, lastActive, osName }) => (
          <DeviceInfoCard
            deviceId={deviceId}
            ip={ip}
            lastActive={lastActive}
            osName={osName}
            currentDeviceId={devices?.current.deviceId}
          />
        ))}
      </div>
    </div>
  )
}
