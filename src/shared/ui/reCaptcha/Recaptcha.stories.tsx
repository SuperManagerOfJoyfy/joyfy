import { Recaptcha } from '@/shared/ui/reCaptcha/Recaptcha'
import { Meta, StoryObj } from '@storybook/nextjs'

const meta: Meta<typeof Recaptcha> = {
  title: 'Components/Recaptcha',
  component: Recaptcha,
  tags: ['autodocs'],
  argTypes: {
    onVerifyAction: { action: 'verified' },
  },
}

export default meta

type Story = StoryObj<typeof Recaptcha>

export const Default: Story = {
  args: {
    siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
    onVerifyAction: (token) => console.log('reCAPTCHA token:', token),
  },
}
