'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { ReactNode } from 'react'
import { FieldValues, Path, SubmitHandler, useForm } from 'react-hook-form'
import { ZodType } from 'zod'
import s from './form.module.scss'

import { Button } from '../button'
import { FormTextField } from '../formTextField/FormTextField'

export type FormProps<T extends FieldValues> = {
  //title: string
  btnText: string
  fields: { name: Path<T>; label?: string; type?: string }[]
  schema: ZodType<T>
  onSubmit: SubmitHandler<T>

  additionalContent?: ReactNode
}

export const Form = <T extends FieldValues>({
  //title,
  btnText,
  fields,
  schema,
  onSubmit,
  additionalContent,
}: FormProps<T>) => {
  const { control, handleSubmit } = useForm<T>({
    resolver: zodResolver(schema),
  })
  return (
    <div className={s.formContainer}>
      <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
        {fields.map(({ name, label, type }) => (
          <FormTextField
            key={name}
            control={control}
            name={name}
            label={label}
            type={type || 'text'}
          />
        ))}

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
