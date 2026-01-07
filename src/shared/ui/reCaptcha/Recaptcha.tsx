'use client'

import s from './Recaptcha.module.scss'
import { useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

type Props = {
  onVerify: (token: string | null) => void
  siteKey: string
}

export const Recaptcha = ({ onVerify, siteKey }: Props) => {
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expired, setExpired] = useState(false)

  const handleRecaptchaChange = (token: string | null) => {
    setError(null)
    setExpired(false)
    if (token) {
      setIsVerified(true)
      onVerify(token)
    } else {
      setIsVerified(false)
      onVerify(null)
    }
  }

  const handleRecaptchaError = () => {
    setError('Ошибка проверки reCAPTCHA')
    setIsVerified(false)
    onVerify(null)
  }

  const handleRecaptchaExpired = () => {
    setExpired(true)
    setIsVerified(false)
    onVerify(null)
  }

  return (
    <div className={s.container}>
      <ReCAPTCHA
        sitekey={siteKey}
        onChange={handleRecaptchaChange}
        onErrored={handleRecaptchaError}
        onExpired={handleRecaptchaExpired}
        theme="dark"
      />
      {isVerified && <div>{isVerified ? 'Проверка пройдена' : 'Проверка не пройдена'}</div>}
      {error && <div>{error}</div>}
      {expired && <div>{expired ? 'Срок действия истек' : ''}</div>}
    </div>
  )
}
