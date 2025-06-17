import { formatSmartDate } from '@/shared/utils/dateFunctions'
import clsx from 'clsx'
import s from './DateStamp.module.scss'

type Props = {
  date: string
  className?: string
}

export const DateStamp = ({ date, className }: Props) => {
  return <div className={clsx(s.date, className)}>{formatSmartDate(date)}</div>
}
