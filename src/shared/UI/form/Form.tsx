'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { ReactNode } from 'react'
import { FieldValues, Path, SubmitHandler, useForm } from 'react-hook-form'
import { ZodType } from 'zod'
import { Typography } from '../typography'
import s from './form.module.scss'
import { Card } from '../card'
import { FormTextField } from '../formTextField/FormTextField'
import { Button } from '../button'

export type FormProps<T extends FieldValues> = {
  title: string
  btnText: string
  fields: { name: Path<T>; label: string; type?: string }[]
  schema: ZodType<T>
  onSubmit: SubmitHandler<T>
  socialAuthButtons?: ReactNode
  additionalContent?: ReactNode
}

export const Form = <T extends FieldValues>({
  title,
  btnText,
  fields,
  schema,
  onSubmit,
  socialAuthButtons,
  additionalContent,
}: FormProps<T>) => {
  const { control, handleSubmit } = useForm<T>({
    resolver: zodResolver(schema),
  })
  return (
    <Card className={s.formContainer}>
      <Typography as="h1" variant="h1" className={s.title}>
        {title}
      </Typography>

      {socialAuthButtons && (
        <div className={s.socialAuthButtons}>{socialAuthButtons}</div>
      )}

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
    </Card>
  )
}
