'use client'

import clsx from 'clsx'
import s from './Loader.module.scss'

type LoaderProps = {
  message?: string
  fullScreen?: boolean
  reduced?: boolean
  embedded?: boolean
  className?: string
}

export const Loader = ({ message = '', fullScreen = true, reduced, embedded, className }: LoaderProps) => {
  return (
    <div className={fullScreen ? s.fullscreen : s.inline} role="status" aria-busy="true">
      <div className={clsx(s.loaderWrapper, reduced && s.reduced, embedded && s.embedded, className)}>
        <svg className={s.loaderSvg} viewBox="0 0 50 50">
          <defs>
            <linearGradient id="loaderGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6f00ff" />
              <stop offset="50%" stopColor="#8a2be2" />
              <stop offset="100%" stopColor="#00c853" />
            </linearGradient>
          </defs>
          <circle className={s.loaderCircle} cx="25" cy="25" r="20" fill="none" strokeWidth="4" />
        </svg>
      </div>
      {message && <p className={s.message}>{message}</p>}
    </div>
  )
}
