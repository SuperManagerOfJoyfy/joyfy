import { Meta, StoryObj } from '@storybook/react'
import { Avatar } from './Avatar'

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    avatar: {
      control: 'text',
      description: 'URL of the avatar image',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Size of the avatar',
    },
  },
}

export default meta
type Story = StoryObj<typeof Avatar>

export const Default: Story = {
  args: {
    size: 'medium',
  },
}

export const Small: Story = {
  args: {
    avatar: 'https://i.pravatar.cc/300',
    size: 'small',
  },
}

export const Medium: Story = {
  args: {
    avatar: 'https://i.pravatar.cc/300',
    size: 'medium',
  },
}

export const Large: Story = {
  args: {
    avatar: 'https://i.pravatar.cc/300',
    size: 'large',
  },
}
