import { DateStamp } from '@/shared/ui'
import { useTranslations } from 'next-intl'

type MetaInfoProps = {
  createdAt: string
  likeCount: number
  className?: string
  likesClassName?: string
}

export const MetaInfo = ({ createdAt, likeCount, likesClassName }: MetaInfoProps) => {
  const t = useTranslations('comments')
  return (
    <>
      <DateStamp date={createdAt} />
      {likeCount > 0 && <span className={likesClassName}>{t('likes', { count: likeCount })}</span>}
    </>
  )
}
