export type DeviceInfo = {
  deviceId: number
  ip: string
  lastActive: string // ISO дата в виде строки
  browserName: string
  browserVersion: string
  deviceName: string
  osName: string
  osVersion: string
  deviceType: string
}

export type UserSession = {
  current: DeviceInfo
  others: DeviceInfo[]
}
