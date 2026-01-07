import type { Meta, StoryObj } from '@storybook/react'
import type { User } from '../../types/userCard.types'
import { UserCard } from './UserCard'

const meta: Meta<typeof UserCard> = {
  title: 'Components/UserCard',
  component: UserCard,
  tags: ['autodocs'],
  argTypes: {
    layout: {
      control: { type: 'radio' },
      options: ['standalone', 'inline', 'stacked'],
    },
    className: {
      control: 'text',
    },
    children: {
      control: 'text',
    },
  },
}

export default meta
type Story = StoryObj<typeof UserCard>

const mockUser: User = {
  id: 1,
  userName: 'JaneDoe',
  avatar: 'https://i.pravatar.cc/150?img=32',
}

export const Standalone: Story = {
  args: {
    user: mockUser,
    layout: 'standalone',
  },
}

export const Inline: Story = {
  args: {
    user: mockUser,
    layout: 'inline',
    children:
      'Comment or post content:  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cupiditate magnam mollitia error neque.',
  },
}

export const Stacked: Story = {
  args: {
    user: mockUser,
    layout: 'stacked',
    children: 'Message text',
  },
}
