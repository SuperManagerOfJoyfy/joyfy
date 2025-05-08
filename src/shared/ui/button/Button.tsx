import { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'
import { clsx } from 'clsx'
import s from './Button.module.scss'

const buttonVariant = ['primary', 'secondary', 'outline', 'text', 'link', 'icon'] as const

type ButtonVariant = (typeof buttonVariant)[number]

const buttonSize = ['small', 'medium', 'large'] as const

type ButtonSize = (typeof buttonSize)[number]

export type ButtonProps<T extends ElementType = 'button'> = {
  as?: T
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  startIcon?: ReactNode
  endIcon?: ReactNode
  className?: string
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
    ...rest
  } = props

  const classNames = clsx(s.button, s[variant], s[size], fullWidth && s.fullWidth, className)

  return (
    <Component className={classNames} {...rest}>
      {startIcon && <span className={s.startIcon}>{startIcon}</span>}
      {children}
      {endIcon && <span className={s.endIcon}>{endIcon}</span>}
    </Component>
  )
}
