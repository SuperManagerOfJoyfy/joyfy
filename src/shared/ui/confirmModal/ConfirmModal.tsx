import { ReactNode } from 'react'
import { Button, Modal, Typography } from '@/shared/ui'

import s from './confirmModal.module.scss'

type Props = {
  title: string
  description: string | ReactNode
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  onConfirm: () => void
}

export const ConfirmModal = ({ title, description, isOpen, setIsOpen, onConfirm }: Props) => {
  function handleConfirm() {
    onConfirm()
    setIsOpen(false)
  }

  return (
    <Modal title={title} className={s.confirmModal} open={isOpen} onOpenChange={setIsOpen}>
      <div className={s.content}>
        <Typography>{description}</Typography>

        <div className={s.buttons}>
          <Button className={s.button} variant={'outline'} onClick={handleConfirm}>
            Yes
          </Button>

          <Button className={s.button} onClick={() => setIsOpen(false)}>
            No
          </Button>
        </div>
      </div>
    </Modal>
  )
}
