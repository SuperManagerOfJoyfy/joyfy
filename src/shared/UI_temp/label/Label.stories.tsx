import type { Meta, StoryObj } from '@storybook/react'
import { Label } from '@/shared/UI_temp/label/Label'
import { TextField } from '@/shared/UI_temp/textField/TextField'

const meta: Meta<typeof Label> = {
  title: 'Components/Label',
  component: Label,
  tags: ['autodocs'],
  argTypes: {
    label: {
      description: 'The text displayed as the label.',
      control: 'text',
    },
    htmlFor: {
      description: 'The ID of the input element the label is associated with.',
      control: 'text',
    },
  },
}

export default meta
type Story = StoryObj<typeof Label>

export const Default: Story = {
  args: {
    label: 'Email',
    children: <TextField />,
  },
}
