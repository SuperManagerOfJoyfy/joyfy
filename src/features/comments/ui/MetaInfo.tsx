import { DateStamp } from '@/shared/ui'

type MetaInfoProps = {
  createdAt: string
  likeCount: number
  className?: string
  likesClassName?: string
}

export const MetaInfo = ({ createdAt, likeCount, likesClassName }: MetaInfoProps) => (
  <>
    <DateStamp date={createdAt} />
    {likeCount > 0 && <span className={likesClassName}>Like: {likeCount}</span>}
  </>
)
