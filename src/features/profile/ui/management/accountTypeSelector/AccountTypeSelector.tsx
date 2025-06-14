import { Card, RadioGroup, Typography } from '@/shared/ui'
import s from './accountTypeSelector.module.scss'
import { typeOptions } from '@/features/profile/ui/management'

type Props = {
  value: string
  onChange: (val: string) => void
}

export const AccountTypeSelector = ({ value, onChange }: Props) => {
  return (
    <div>
      <Typography className={s.title} variant="h3">
        Account type:
      </Typography>

      <Card className={s.card}>
        <RadioGroup
          name="account-type"
          options={typeOptions}
          className={s.radioGroup}
          value={value}
          onValueChange={onChange}
        />
      </Card>
    </div>
  )
}
