'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { ReactNode, useEffect } from 'react'
import { DefaultValues, FieldValues, Path, SubmitHandler, useForm } from 'react-hook-form'
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
  disabled?: boolean
  serverError?: { field: Path<T>; message: string } | null
}

export const Form = <T extends FieldValues>({
  btnText,
  fields,
  schema,
  onSubmit,
  additionalContent,
  disabled = false,
  serverError,
}: FormProps<T>) => {
  const defaultValues: DefaultValues<T> = fields.reduce((acc, field) => {
    if (field.type === 'checkbox') {
      acc[field.name] = false as any
    } else {
      acc[field.name] = '' as any
    }
    return acc
  }, {} as DefaultValues<T>)

  const { control, handleSubmit, watch, reset, setError } = useForm<T>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues,
  })

  useEffect(() => {
    if (serverError) {
      setError(serverError.field, {
        type: 'server',
        message: serverError.message,
      })
    }
  }, [serverError, setError])

  const values = watch()

  const allFieldsFilled = fields.every((field) => {
    const value = values[field.name]
    if (field.type === 'checkbox') return Boolean(value)
    return value !== undefined && value !== ''
  })

  const handleFormSubmit: SubmitHandler<T> = async (data) => {
    try {
      await onSubmit(data)
      reset()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className={s.formContainer}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className={s.form}>
        {fields.map(({ name, label, type }) =>
          type === 'checkbox' ? (
            <ControlledCheckbox key={name} control={control} name={name} label={label} disabled={disabled} />
          ) : (
            <ControlledTextField
              key={name}
              control={control}
              name={name}
              label={label}
              type={type || 'text'}
              disabled={disabled}
            />
          )
        )}

        {additionalContent && <div className={s.additionalContent}>{additionalContent}</div>}

        <Button type="submit" fullWidth disabled={disabled || !allFieldsFilled}>
          {btnText}
        </Button>
      </form>
    </div>
  )
}
