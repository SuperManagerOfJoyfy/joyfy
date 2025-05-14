import { ComponentProps, useId } from 'react'
import clsx from 'clsx'
import s from './textArea.module.scss'

type Props = {
  label?: string
  error?: string
  className?: string
} & ComponentProps<'textarea'>

export const TextArea = ({ label, error, className, ...props }: Props) => {
  const id = useId()

  return (
    <div className={clsx(s.textAreaContainer)}>
      <label className={s.label} htmlFor={id} aria-disabled={props.disabled}>
        {label}
      </label>

      <div className={clsx(s.wrapper, error && s.error)}>
        <textarea
          className={clsx(s.textArea, error && s.error, className)}
          data-value={props.value && 'true'}
          id={id}
          {...props}
        />
      </div>

      <span className={s.errorText}>{error}</span>
    </div>
  )
}
