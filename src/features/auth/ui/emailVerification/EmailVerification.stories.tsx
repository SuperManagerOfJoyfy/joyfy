import { Meta, StoryObj } from '@storybook/react'
import infoImg from '@/features/auth/assets/images/EmailVerification/confirm.png'
import expiredImg from '@/features/auth/assets/images/EmailVerification/expired.png'
import { EmailVerification } from './EmailVerification'
import { Button, TextField } from '@/shared/ui'

const meta: Meta<typeof EmailVerification> = {
  title: 'Features/EmailVerification',
  component: EmailVerification,
  tags: ['autodocs'],
  argTypes: {
    title: {
      description: 'The title of the information block',
      control: 'text',
    },
    description: {
      description: 'The description or main text of the information block',
      control: 'text',
    },
    imageSrc: {
      description: 'The source of the image to be displayed in the information block',
      control: 'text',
    },
    children: {
      description: 'Additional content or elements to be displayed below the description',
    },
  },
}

export default meta
type Story = StoryObj<typeof EmailVerification>

export const Informative: Story = {
  args: {
    title: 'Congratulations!',
    description: 'Your email has been confirmed',
    imageSrc: infoImg,
    children: (
      <div style={{ marginTop: '54px', maxWidth: '182px', width: '100%' }}>
        <Button as="a" fullWidth>
          Sign in
        </Button>
      </div>
    ),
  },
}

export const EmailExpired: Story = {
  args: {
    title: 'Email verification link expired',
    description: 'Looks like the verification link has expired. Not to worry, we can send the link again',
    imageSrc: expiredImg,
    children: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '30px' }}>
        <TextField label="Email" placeholder="Epam@epam.com" />
        <Button>Resend verification link</Button>
      </div>
    ),
  },
}
