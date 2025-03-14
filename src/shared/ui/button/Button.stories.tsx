import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { MdLanguage } from 'react-icons/md'
import Image from 'next/image'
import flagUnitedKingdom from './../../../assets/images/flagUnitedKingdom.png'
import { Button } from './Button'

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onClick: { action: 'clicked' },
    variant: {
      control: { type: 'radio' },
      options: ['primary', 'secondary', 'outline', 'text', 'link'],
      description: 'The visual style of the button',
    },
    size: {
      control: { type: 'radio' },
      options: ['small', 'medium', 'large'],
      description: 'The size of the button',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    fullWidth: {
      control: 'boolean',
      description:
        'Whether the button should take up the full width of its container',
    },
    startIcon: {
      control: { type: 'object' },
      description: 'Icon to display at the start of the button',
    },
    endIcon: {
      control: { type: 'object' },
      description: 'Icon to display at the end of the button',
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    children: 'Primary button',
    disabled: false,
    variant: 'primary',
  },
}

export const Secondary: Story = {
  args: {
    children: 'Secondary button',
    disabled: false,
    variant: 'secondary',
  },
}

export const Outline: Story = {
  args: {
    children: 'Outline button',
    disabled: false,
    variant: 'outline',
  },
}

export const Text: Story = {
  args: {
    children: 'Text button',
    disabled: false,
    variant: 'text',
  },
}

export const Link: Story = {
  args: {
    children: 'button that looks like a link',
    disabled: false,
    variant: 'link',
  },
}

export const FullWidth: Story = {
  args: {
    children: 'Full Width button',
    disabled: false,
    fullWidth: true,
    variant: 'primary',
  },
  parameters: {
    layout: 'fullscreen',
  },
  render: (args) => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        padding: '16px',
        boxSizing: 'border-box',
      }}
    >
      <Button {...args} />
    </div>
  ),
}

export const Sizes: Story = {
  args: {
    children: 'Button',
    variant: 'secondary',
  },
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Button size="small">Small</Button>
      <Button size="medium">Medium</Button>
      <Button size="large">Large</Button>
    </div>
  ),
}

export const WithIcon: Story = {
  args: {
    variant: 'primary',
    children: 'button with Start Icon',
    startIcon: <MdLanguage size={24} />,
  },
}

export const WithPngImage: Story = {
  args: {
    variant: 'primary',
    size: 'small',
    children: 'English',
    startIcon: (
      <Image src={flagUnitedKingdom} alt="UK flag" width={20} height={20} />
    ),
  },
}

export const WithEndIcon: Story = {
  args: {
    variant: 'primary',
    children: 'button with End Icon',
    endIcon: <span>→</span>,
  },
}

export const WithBothIcons: Story = {
  args: {
    variant: 'primary',
    children: 'button with Both Icons',
    startIcon: <span>🔍</span>,
    endIcon: <span>→</span>,
  },
}
