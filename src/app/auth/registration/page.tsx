'use client'
import { SignupForm } from '@/features/auth/ui/signupForm'
import SentEmailModal from '@/features/auth/ui/sentEmailModal/SentEmailModal'
import { useState } from 'react'

const Registration = () => {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="container">
      <SignupForm
        onSubmitSuccess={() => {
          setModalOpen(true)
        }}
      />
      <SentEmailModal open={modalOpen} />
    </div>
  )
}

export default Registration
