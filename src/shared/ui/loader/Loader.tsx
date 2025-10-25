'use client'

import clsx from 'clsx'
import s from './Loader.module.scss'

type LoaderProps = {
  message?: string
  fullScreen?: boolean
  reduced?: boolean
  className?: string
}

export const Loader = ({ message = '', fullScreen = true, reduced, className }: LoaderProps) => {
  return (
    <div className={fullScreen ? s.fullscreen : s.inline} role="status" aria-busy="true">
      <div className={clsx(s.spinner, reduced && s.reduced, className)} />
      {message && <p className={s.message}>{message}</p>}
    </div>
  )
}
