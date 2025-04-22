import { FieldValues, UseControllerProps, useController } from 'react-hook-form'
import { Checkbox, CheckboxProps } from '../checkbox'

type Props<T extends FieldValues> = Omit<
  CheckboxProps,
  'checked' | 'disabled' | 'name'
> &
  UseControllerProps<T>

export const ControlledCheckbox = <T extends FieldValues>({
  control,
  defaultValue,
  disabled,
  name,
  ...checkboxProps
}: Props<T>) => {
  const {
    field: { onChange, value, ...field },
    fieldState: { error },
  } = useController({ control, defaultValue, disabled, name })

  return (
    <div>
      <Checkbox
        checked={!!value}
        onCheckedChange={onChange}
        errorMessage={error?.message}
        {...checkboxProps}
        {...field}
      />
    </div>
  )
}
