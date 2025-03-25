'use client'

import { Control, FieldPath, FieldValues, useController } from 'react-hook-form'
import { TextField, TextFieldProps } from '../textField/TextField'

type FormTextFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
} & Omit<TextFieldProps, 'id' | 'onChange' | 'value'>

export const ControlledTextField = <TFieldValues extends FieldValues>({
  control,
  name,
  ...rest
}: FormTextFieldProps<TFieldValues>) => {
  const {
    field,
    fieldState: { error },
  } = useController({ control, name })

  return (
    <TextField
      {...rest}
      {...field}
      value={field.value ?? ''}
      errorMessage={error?.message}
      id={name}
    />
  )
}
