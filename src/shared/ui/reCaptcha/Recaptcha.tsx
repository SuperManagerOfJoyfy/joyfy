'use client'

import { useEffect, useRef, useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import s from './Recaptcha.module.scss'

type Props = {
  onVerifyAction: (token: string | null) => void
  siteKey: string
  showRequiredError?: boolean
  messages?: {
    required: string
    failed: string
    expired: string
    error: string
  }
}

export const Recaptcha = ({ onVerifyAction, siteKey, showRequiredError, messages }: Props) => {
  const recaptchaRef = useRef<ReCAPTCHA | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    if (showRequiredError) {
      setError(messages?.required ?? 'This field is required')
      recaptchaRef.current?.reset()
    }
  }, [showRequiredError])

  const handleRecaptchaChange = (token: string | null) => {
    setExpired(false)
    if (token) {
      setError(null)
      onVerifyAction(token)
    } else {
      setError(messages?.failed ?? 'Verification failed')
      onVerifyAction(null)
    }
  }

  const handleRecaptchaError = () => {
    setError(messages?.error ?? 'Verification error')
    recaptchaRef.current?.reset()
    onVerifyAction(null)
  }

  const handleRecaptchaExpired = () => {
    setExpired(true)
    recaptchaRef.current?.reset()
    setError(messages?.expired ?? 'Verification expired')
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
      {(error || expired) && <p className={s.errorMessage}>{error}</p>}
    </div>
  )
}
