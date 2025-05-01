import { formatSmartDate } from '@/shared/utils/dateFunctions'
import s from './DateStamp.module.scss'

type Props = {
  date: string
}

export const DateStamp = ({ date }: Props) => {
  return <span className={s.date}>{formatSmartDate(date)}</span>
}
