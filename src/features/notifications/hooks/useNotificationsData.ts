import { useSelector } from 'react-redux'
import { notificationsApi } from '../api/notificationsApi'

export const useNotificationsData = () => {
  const selectNotificationsResult = notificationsApi.endpoints.getNotifications.select()

  const notificationsResult = useSelector(selectNotificationsResult)

  return notificationsResult?.data || null
}
