import { Typography } from '@/shared/ui'
import s from './Messenger.module.scss'

const Banner = () => {
  return (
    <div className={s.banner}>
      <Typography variant="body2">Choose who you would like to talk to</Typography>
    </div>
  )
}

export default Banner
