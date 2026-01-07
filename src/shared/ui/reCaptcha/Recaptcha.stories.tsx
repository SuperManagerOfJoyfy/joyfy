import { Recaptcha } from '@/shared/ui/reCaptcha/Recaptcha'
import { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof Recaptcha> = {
  title: 'Components/Recaptcha',
  component: Recaptcha,
  tags: ['autodocs'],
  argTypes: {
    onVerify: { action: 'verified' },
  },
}

export default meta

type Story = StoryObj<typeof Recaptcha>

export const Default: Story = {
  args: {
    // siteKey: '6LfpOuMqAAAAAE9xTZ1PP4CH-WUsTq5al9vEw0nJ',
    siteKey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
    onVerify: (token) => console.log('reCAPTCHA token:', token),
  },
}
