import { Button, Typography } from '@/shared/ui'
import { Card } from '@/shared/ui/card'
import s from './login.module.scss'
import clsx from 'clsx'

type Props = {
  className?: string
}

export const Login = ({}: Props) => {
  return (
    <Card className={clsx(s.card)}>
      <Typography variant="h1">Sign In</Typography>

      <div className={s.buttonsWrapper}>
        <Button className={s.button}>
          <img src="" alt="google" />
        </Button>

        <Button className={s.button}>
          <img src="" alt="gitHub" />
        </Button>
      </div>
    </Card>
  )
}
