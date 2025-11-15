'use client'

import { useRef, useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import s from './Recaptcha.module.scss'

type Props = {
  onVerifyAction: (token: string | null) => void
  siteKey: string
}

export const Recaptcha = ({ onVerifyAction, siteKey }: Props) => {
  const recaptchaRef = useRef<ReCAPTCHA | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [expired, setExpired] = useState(false)

  const handleRecaptchaChange = (token: string | null) => {
    setExpired(false)
    if (token) {
      setError(null)
      onVerifyAction(token)
    } else {
      setError('Verification failed. Please try again.')
      onVerifyAction(null)
    }
  }

  const handleRecaptchaError = () => {
    setError('An error occurred during verification. Please try again.')
    recaptchaRef.current?.reset()
    onVerifyAction(null)
  }

  const handleRecaptchaExpired = () => {
    setExpired(true)
    recaptchaRef.current?.reset()
    setError('Verification expired. Please check the box again.')
    onVerifyAction(null)
  }

  return (
    <div className={s.container}>
      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey={siteKey}
        onChange={handleRecaptchaChange}
        onErrored={handleRecaptchaError}
        onExpired={handleRecaptchaExpired}
        theme="dark"
      />
      {(error || expired) && (
        <p className={s.errorMessage}>{error ?? 'Verification expired. Please check the box again.'}</p>
      )}
    </div>
  )
}
