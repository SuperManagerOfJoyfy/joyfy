'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { ReactNode } from 'react'
import { FieldValues, Path, SubmitHandler, useForm } from 'react-hook-form'
import { ZodType } from 'zod'
import s from './form.module.scss'

import { ControlledCheckbox, ControlledTextField } from '@/shared/ui'
import { Button } from '../button'

export type FormProps<T extends FieldValues> = {
  btnText: string
  fields: { name: Path<T>; label?: ReactNode; type?: string }[]
  schema: ZodType<T>
  onSubmit: SubmitHandler<T>
  type?: string
  additionalContent?: ReactNode
}

export const Form = <T extends FieldValues>({
  btnText,
  fields,
  schema,
  onSubmit,
  additionalContent,
}: FormProps<T>) => {
  const { control, handleSubmit, formState } = useForm<T>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
  })
  console.log('🚨 Validation errors:', formState.errors)
  console.log('✅ Current form values:', control._formValues)
  return (
    <div className={s.formContainer}>
      <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
        {fields.map(({ name, label, type }) =>
          type === 'checkbox' ? (
            <ControlledCheckbox
              key={name}
              control={control}
              name={name}
              label={label}
            />
          ) : (
            <ControlledTextField
              key={name}
              control={control}
              name={name}
              label={label}
              type={type || 'text'}
            />
          )
        )}

        {additionalContent && (
          <div className={s.additionalContent}>{additionalContent}</div>
        )}

        <Button type="submit" fullWidth>
          {btnText}
        </Button>
      </form>
    </div>
  )
}
