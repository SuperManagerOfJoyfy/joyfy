import type { Meta, StoryObj } from '@storybook/react'
import { subDays, subHours, subMinutes, subMonths } from 'date-fns'
import { DateStamp } from './DateStamp'

const meta: Meta<typeof DateStamp> = {
  title: 'Components/DateStamp',
  component: DateStamp,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    date: {
      control: 'date',
      description: 'ISO date string to be formatted',
    },
    className: {
      control: 'text',
      description: 'Optional CSS class to customize styling',
    },
  },
}

export default meta
type Story = StoryObj<typeof DateStamp>

const getISODate = (dateObj: Date): string => dateObj.toISOString()

const now = new Date()

export const Current: Story = {
  args: {
    date: getISODate(now),
  },
}

export const MinutesAgo: Story = {
  args: {
    date: getISODate(subMinutes(now, 30)),
  },
}

export const HoursAgo: Story = {
  args: {
    date: getISODate(subHours(now, 5)),
  },
}

export const Yesterday: Story = {
  args: {
    date: getISODate(subDays(now, 1)),
  },
}

export const TwoDaysAgo: Story = {
  args: {
    date: getISODate(subDays(now, 2)),
  },
}

export const LastMonth: Story = {
  args: {
    date: getISODate(subMonths(now, 1)),
  },
}
