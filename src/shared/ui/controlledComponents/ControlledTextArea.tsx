'use client'

import { Control, FieldPath, FieldValues, useController } from 'react-hook-form'
import { TextArea, TextAreaProps } from '../textArea'

type FormTextFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
} & Omit<TextAreaProps, 'id' | 'onChange' | 'value'>

export const ControlledTextArea = <TFieldValues extends FieldValues>({
  control,
  name,
  ...rest
}: FormTextFieldProps<TFieldValues>) => {
  const {
    field,
    fieldState: { error },
  } = useController({ control, name })

  return <TextArea {...rest} {...field} value={field.value ?? ''} error={error?.message} id={name} />
}
