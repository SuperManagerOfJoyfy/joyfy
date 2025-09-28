'use client'

import { Card, RadioGroup, Typography } from '@/shared/ui'
import s from './accountTypeSelector.module.scss'
import { typeOptions } from '@/features/profile/ui/management'
import { AccountType } from '@/features/profile/api'
import { useTranslations } from 'next-intl'

type Props = {
  value: string
  onChange: (type: AccountType) => void
}

export const AccountTypeSelector = ({ value, onChange }: Props) => {
  const t = useTranslations('accountTypeSelector')

  return (
    <div>
      <Typography className={s.title} variant="h3">
        {t('title')}
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
