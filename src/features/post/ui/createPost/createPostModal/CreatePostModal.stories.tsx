import type { Meta, StoryObj } from '@storybook/react'
import { CreatePostModal } from './CreatePostModal'
import { useState } from 'react'
import { Button } from '@/shared/ui'

const meta: Meta<typeof CreatePostModal> = {
  title: 'features/post/CreatePostModal',
  component: CreatePostModal,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof CreatePostModal>

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Create Post Modal</Button>
        <CreatePostModal open={open} onClose={() => setOpen(false)} />
      </>
    )
  },
}
