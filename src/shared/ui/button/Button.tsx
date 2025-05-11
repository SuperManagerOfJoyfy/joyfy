import { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'
import { clsx } from 'clsx'
import s from './Button.module.scss'

const buttonVariant = ['primary', 'secondary', 'outline', 'text', 'link', 'icon', 'clean'] as const

type ButtonVariant = (typeof buttonVariant)[number]

const buttonSize = ['small', 'medium', 'large'] as const

type ButtonSize = (typeof buttonSize)[number]

type ButtonProps<T extends ElementType = 'button'> = {
  as?: T
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  startIcon?: ReactNode
  endIcon?: ReactNode
  className?: string
  customStyles?: boolean
  noPadding?: boolean
} & ComponentPropsWithoutRef<T>

export const Button = <T extends ElementType = 'button'>(props: ButtonProps<T>) => {
  const {
    as: Component = 'button',
    variant = 'primary',
    size = 'medium',
    fullWidth = false,
    startIcon,
    endIcon,
    children,
    className,
    customStyles = false,
    noPadding = false,
    ...rest
  } = props

  const classNames = clsx(
    s.button,
    !customStyles && s[variant],
    !customStyles && s[size],
    fullWidth && s.fullWidth,
    noPadding && s.noPadding,
    className
  )

  return (
    <Component className={classNames} {...rest}>
      {startIcon && <span className={s.startIcon}>{startIcon}</span>}
      {children}
      {endIcon && <span className={s.endIcon}>{endIcon}</span>}
    </Component>
  )
}
