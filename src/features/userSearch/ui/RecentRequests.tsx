import { Typography } from '@/shared/ui'
import { User } from './User'
import { UserItem } from '../api/usersApi.types'
import s from './UserSearch.module.scss'
import { useTranslations } from 'next-intl'

type Props = { recentRequests: UserItem[]; addRequest: (user: UserItem) => void }

export const RecentRequests = ({ recentRequests, addRequest }: Props) => {
  const t = useTranslations('userSearch')

  return (
    <div className={s.recentWrapper}>
      <Typography variant="h3">{t('recent.title')}</Typography>
      {recentRequests.length > 0 ? (
        <>
          {recentRequests.map((req) => (
            <User user={req} handleRequestClick={addRequest} key={req.id} />
          ))}
        </>
      ) : (
        <div className={s.emptyList}>
          <Typography>{t('recent.emptyTitle')}</Typography>
          <Typography variant="caption">{t('recent.emptyCaption')}</Typography>
        </div>
      )}
    </div>
  )
}
