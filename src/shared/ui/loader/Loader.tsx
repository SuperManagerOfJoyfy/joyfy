'use client'

import s from './Loader.module.scss'

type LoaderProps = {
  message?: string
  fullScreen?: boolean
}

export const Loader = ({
  message = 'Loading...',
  fullScreen = true,
}: LoaderProps) => {
  return (
    <div
      className={fullScreen ? s.fullscreen : s.inline}
      role="status"
      aria-busy="true"
    >
      <div className={s.spinner} />
      <p className={s.message}>{message}</p>
    </div>
  )
}
