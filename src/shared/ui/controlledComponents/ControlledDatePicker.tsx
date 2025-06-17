'use client'

import { Controller, Control } from 'react-hook-form'
import { DatePicker } from '../datePicker/DatePicker'
import { formatDateToString, parseDateString } from '@/shared/utils/dateFunctions'
import { ReactNode } from 'react'

type Props = {
  name: string
  control: Control<any>
  label?: string | ReactNode
  error?: string
  disabled?: boolean
}

export const ControlledDatePicker = ({ name, control, label, disabled }: Props) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => {
        return (
          <DatePicker
            label={label}
            startDate={parseDateString(value)}
            onSetStartDate={(date: Date | null) => {
              onChange(formatDateToString(date))
            }}
            disabled={disabled}
          />
        )
      }}
    />
  )
}
