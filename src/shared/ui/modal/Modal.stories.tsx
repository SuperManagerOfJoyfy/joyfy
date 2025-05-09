import { useEffect, useState } from 'react'
import { Meta, StoryObj } from '@storybook/react'

import { Modal } from './Modal'
import { Button } from '../button'
import { Typography } from '../typography'

const meta = {
  component: Modal,
  tags: ['autodocs'],
  title: 'Components/Modal',
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'auto'],
      description: 'Size Modal',
      defaultValue: 'sm',
    },
    open: {
      control: 'boolean',
      description: 'Close/Open Modal',
    },
  },
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    open: false,
    title: 'Modal',
    size: 'sm',
  },
  render: (args) => {
    const [internalOpen, setInternalOpen] = useState(args.open)

    useEffect(() => {
      setInternalOpen(args.open)
    }, [args.open])

    const handleOpenChange = (isOpen: boolean) => {
      setInternalOpen(isOpen)
      args.onOpenChange?.(isOpen)
    }

    return (
      <>
        <Button onClick={() => handleOpenChange(true)}>Open Modal</Button>
        <Modal {...args} open={internalOpen} onOpenChange={handleOpenChange}>
          <div style={{ padding: '30px 0 12px' }}>
            <Typography variant="body1">Modal content here</Typography>
          </div>
        </Modal>
      </>
    )
  },
}

export const EmailSent: Story = {
  args: {
    open: false,
    title: 'Email sent',
  },
  render: (args) => {
    const [internalOpen, setInternalOpen] = useState(args.open)

    useEffect(() => {
      setInternalOpen(args.open)
    }, [args.open])

    const handleOpenChange = (isOpen: boolean) => {
      setInternalOpen(isOpen)
      args.onOpenChange?.(isOpen)
    }

    return (
      <>
        <Button onClick={() => handleOpenChange(true)}>Show Email Sent Modal</Button>
        <Modal {...args} open={internalOpen} onOpenChange={handleOpenChange} title="Email sent">
          <div style={{ padding: '30px 0 12px' }}>
            <Typography variant="body1" style={{ marginBottom: '18px' }}>
              We have sent a link to confirm your email to epam@epam.com
            </Typography>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={() => handleOpenChange(false)}>OK</Button>
            </div>
          </div>
        </Modal>
      </>
    )
  },
}

export const CustomSized: Story = {
  args: {
    open: false,
    title: 'Custom Size Modal',
    size: 'md',
  },
  render: (args) => {
    const [internalOpen, setInternalOpen] = useState(args.open)

    useEffect(() => {
      setInternalOpen(args.open)
    }, [args.open])

    const handleOpenChange = (isOpen: boolean) => {
      setInternalOpen(isOpen)
      args.onOpenChange?.(isOpen)
    }

    return (
      <>
        <Button onClick={() => handleOpenChange(true)}>Open Custom Size Modal</Button>
        <Modal {...args} open={internalOpen} onOpenChange={handleOpenChange}>
          <div
            style={{
              padding: '20px 0',
              display: 'flex',
              flexDirection: 'column',
              height: '400px',
            }}
          >
            <Typography variant="body1">This is a custom sized modal with different dimensions.</Typography>
            <div
              style={{
                marginTop: 'auto',
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <Button onClick={() => handleOpenChange(false)}>Close</Button>
            </div>
          </div>
        </Modal>
      </>
    )
  },
}

export const CustomOpacity: Story = {
  args: {
    open: false,
    title: 'Custom Opacity Modal',
    size: 'md',
  },
  render: (args) => {
    const [internalOpen, setInternalOpen] = useState(args.open)

    useEffect(() => {
      setInternalOpen(args.open)
    }, [args.open])

    const handleOpenChange = (isOpen: boolean) => {
      setInternalOpen(isOpen)
      args.onOpenChange?.(isOpen)
    }

    return (
      <>
        <Button onClick={() => handleOpenChange(true)}>Open Opacity Overlay</Button>
        <Modal {...args} open={internalOpen} onOpenChange={handleOpenChange} overlayOpacity={1}>
          <div
            style={{
              padding: '20px 0',
              display: 'flex',
              flexDirection: 'column',
              height: '400px',
            }}
          >
            <Typography variant="body1">This modal has an overlay with 100% opacity.</Typography>
            <div
              style={{
                marginTop: 'auto',
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <Button onClick={() => handleOpenChange(false)}>Close</Button>
            </div>
          </div>
        </Modal>
      </>
    )
  },
}

export const NoHeader: Story = {
  args: {
    open: false,
    size: 'sm',
  },
  render: (args) => {
    const [internalOpen, setInternalOpen] = useState(args.open)

    useEffect(() => {
      setInternalOpen(args.open)
    }, [args.open])

    const handleOpenChange = (isOpen: boolean) => {
      setInternalOpen(isOpen)
      args.onOpenChange?.(isOpen)
    }

    return (
      <>
        <Button onClick={() => handleOpenChange(true)}>Open Modal Without Header</Button>
        <Modal {...args} open={internalOpen} onOpenChange={handleOpenChange}>
          <div style={{ paddingTop: '40px', paddingBottom: '24px' }}>
            <Typography variant="body1" style={{ marginBottom: '16px' }}>
              This modal has no title or header, just content and a close button in the corner.
            </Typography>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={() => handleOpenChange(false)}>Close</Button>
            </div>
          </div>
        </Modal>
      </>
    )
  },
}
