import { Meta } from '@storybook/react'
import { ConfirmModal } from './ConfirmModal'
import { Button } from '@/shared/ui'
import { useState } from 'react'

const meta = {
  component: ConfirmModal,
  tags: ['autodocs'],
  title: 'Components/Confirmation Modal',
} satisfies Meta<typeof ConfirmModal>

export default meta

export const Default = {
  render: () => {
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false)

    return (
      <>
        <Button onClick={() => setIsOpenModal(true)}>Open Modal</Button>

        <ConfirmModal
          title={'Delete Post'}
          description={'Are you sure you want to delete this post?'}
          isOpen={isOpenModal}
          setIsOpen={setIsOpenModal}
          onConfirm={() => console.log('Confirmed')}
        />
      </>
    )
  },
}
