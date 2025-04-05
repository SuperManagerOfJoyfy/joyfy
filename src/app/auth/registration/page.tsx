'use client'
import { SignupForm } from '@/features/auth/ui/signupForm'
import SentEmailModal from '@/features/auth/ui/sentEmailModal/SentEmailModal'
import { useState } from 'react'

const Registration = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')

  return (
    <div className="container">
      <SignupForm
        onSubmitSuccess={(email: string) => {
          setModalOpen(true)
          setRegisteredEmail(email)
        }}
      />
      <SentEmailModal open={modalOpen} email={registeredEmail} />
    </div>
  )
}

export default Registration
