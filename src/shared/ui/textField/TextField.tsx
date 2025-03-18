import React, {
  ComponentProps,
  KeyboardEvent,
  ReactNode,
  useId,
  useState,
} from 'react'
import s from './TextField.module.scss'
import { Label } from '@/shared/ui/label/Label'
import { FiSearch } from 'react-icons/fi'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import clsx from 'clsx'

export type Props = ComponentProps<'input'> & {
  errorMessage?: string
  label?: ReactNode
  search?: boolean
  startIcon?: ReactNode
  onEnter?: (e: KeyboardEvent<HTMLInputElement>) => void
  onShowPasswordClick?: () => void
}

export const TextField = ({
  className,
  search,
  label,
  errorMessage,
  startIcon,
  onKeyDown,
  onEnter,
  onShowPasswordClick,
  disabled,
  type = 'text',
  ...rest
}: Props) => {
  const [showPassword, setShowPassword] = useState(false)

  const inputId = useId()
  if (search) {
    startIcon = <FiSearch />
  }

  const isPassword = type === 'password'
  const inputType = showPassword ? 'text' : type

  const dataIconStart = startIcon ? 'start' : ''
  const dataIconEnd = isPassword ? 'end' : ''
  const dataIcon = dataIconStart + dataIconEnd

  const showError = !!errorMessage && errorMessage.length > 0

  const classNames = {
    root: clsx(s.box, className),
    inputContainer: s.inputContainer,
    input: clsx(s.input, showError && s.error),
    startIcon: s.startIcon,
    endIconButton: s.endIconButton,
    errorText: s.errorText,
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (onEnter && e.key === 'Enter') {
      onEnter(e)
    }
    onKeyDown?.(e)
  }

  const togglePasswordHandler = () => {
    setShowPassword((prev) => !prev)
    onShowPasswordClick?.()
  }

  return (
    <div className={classNames.root}>
      {label && <Label htmlFor={inputId} label={label} disabled={disabled} />}
      <div className={classNames.inputContainer}>
        {startIcon && <span className={classNames.startIcon}>{startIcon}</span>}
        <input
          type={inputType}
          className={classNames.input}
          onKeyDown={handleKeyDown}
          data-icon={dataIcon}
          disabled={disabled}
          {...rest}
          id={inputId}
        />

        {isPassword && (
          <button
            onClick={togglePasswordHandler}
            className={classNames.endIconButton}
          >
            {showPassword ? <FiEye /> : <FiEyeOff />}
          </button>
        )}
      </div>
      {showError && <p className={classNames.errorText}>{errorMessage}</p>}
    </div>
  )
}
