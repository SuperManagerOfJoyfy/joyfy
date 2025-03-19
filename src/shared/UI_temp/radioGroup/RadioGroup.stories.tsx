import type { Meta, StoryObj } from '@storybook/react'
import { RadioGroup } from '@/shared/UI_temp/radioGroup/RadioGroup'

const meta = {
  component: RadioGroup,
  tags: ['autodocs'],
  title: 'Components/Radio Group',
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Disables the radio group',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message to display',
    },
  },
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#000' }],
    },
  },
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    options: [{ label: 'RadioGroup', value: 'radio-group' }],
  },
}

export const WithMultipleOptions: Story = {
  args: {
    options: [
      { label: 'Option One', value: 'option-one' },
      { label: 'Option Two', value: 'option-two' },
      { label: 'Option Three', value: 'option-three' },
    ],
  },
}

export const WithError: Story = {
  args: {
    options: [
      { label: 'Option One', value: 'option-one' },
      { label: 'Option Two', value: 'option-two' },
    ],
    errorMessage: 'Please select an option',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    options: [{ label: 'RadioGroup', value: 'radio-group' }],
  },
}

export const DisabledSelected: Story = {
  args: {
    disabled: true,
    options: [{ label: 'RadioGroup', value: 'radio-group' }],
    defaultValue: 'radio-group',
  },
}
