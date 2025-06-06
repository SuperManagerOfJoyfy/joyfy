import { Meta, StoryObj } from '@storybook/react'
import { UserCard } from './UserCard'

const meta: Meta<typeof UserCard> = {
  title: 'Components/UserCard',
  component: UserCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    user: {
      description: 'User object containing id, userName, and optional avatar',
      control: 'object',
    },
  },
}

export default meta
type Story = StoryObj<typeof UserCard>

export const Default: Story = {
  args: {
    user: {
      id: 1,
      userName: 'johndoe',
    },
  },
}

export const WithAvatar: Story = {
  args: {
    user: {
      id: 2,
      userName: 'janedoe',
      avatar: 'https://i.pravatar.cc/300?img=5',
    },
  },
}
