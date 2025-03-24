import type { Meta, StoryObj } from '@storybook/react'
import { Typography } from './Typography'

const meta = {
  component: Typography,
  tags: ['autodocs'],
  title: 'Components/Typography',
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: { type: 'radio' },
      options: [
        'large',
        'h1',
        'h2',
        'h3',
        'body1',
        'body2',
        'caption',
        'caption2',
        'link1',
        'link2',
      ],
    },
    fontWeight: {
      control: { type: 'radio' },
      options: ['regular', 'medium', 'bold'],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ color: 'var(--color-light-100)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Typography>

export default meta
type Story = StoryObj<typeof meta>

export const Large: Story = {
  args: {
    children:
      'Carosserie Test Zürich\nStauffacherstrasse 31\n8004 Zürich, ZH, CH',
    variant: 'large',
  },
}

export const H1: Story = {
  args: {
    children:
      'Carosserie Test Zürich\nStauffacherstrasse 31\n8004 Zürich, ZH, CH',
    variant: 'h1',
  },
}

export const H2: Story = {
  args: {
    children:
      'Carosserie Test Zürich\nStauffacherstrasse 31\n8004 Zürich, ZH, CH',
    variant: 'h2',
  },
}

export const H3: Story = {
  args: {
    children:
      'Carosserie Test Zürich\nStauffacherstrasse 31\n8004 Zürich, ZH, CH',
    variant: 'h3',
  },
}

export const Body1Regular: Story = {
  args: {
    children:
      'Carosserie Test Zürich\nStauffacherstrasse 31\n8004 Zürich, ZH, CH',
    variant: 'body1',
    fontWeight: 'regular',
  },
}

export const Body1Bold: Story = {
  args: {
    children:
      'Carosserie Test Zürich\nStauffacherstrasse 31\n8004 Zürich, ZH, CH',
    variant: 'body1',
    fontWeight: 'bold',
  },
}

export const Body2Regular: Story = {
  args: {
    children:
      'Carosserie Test Zürich\nStauffacherstrasse 31\n8004 Zürich, ZH, CH',
    variant: 'body2',
    fontWeight: 'regular',
  },
}

export const Body2Medium: Story = {
  args: {
    children:
      'Carosserie Test Zürich\nStauffacherstrasse 31\n8004 Zürich, ZH, CH',
    variant: 'body2',
    fontWeight: 'medium',
  },
}

export const Body2Bold: Story = {
  args: {
    children:
      'Carosserie Test Zürich\nStauffacherstrasse 31\n8004 Zürich, ZH, CH',
    variant: 'body2',
    fontWeight: 'bold',
  },
}

export const Caption: Story = {
  args: {
    children:
      'Carosserie Test Zürich\nStauffacherstrasse 31\n8004 Zürich, ZH, CH',
    variant: 'caption',
  },
}

export const Caption2: Story = {
  args: {
    children:
      'Carosserie Test Zürich\nStauffacherstrasse 31\n8004 Zürich, ZH, CH',
    variant: 'caption2',
  },
}

export const Link1: Story = {
  args: {
    children:
      'Carosserie Test Zürich\nStauffacherstrasse 31\n8004 Zürich, ZH, CH',
    variant: 'link1',
  },
}

export const Link2: Story = {
  args: {
    children:
      'Carosserie Test Zürich\nStauffacherstrasse 31\n8004 Zürich, ZH, CH',
    variant: 'link2',
  },
}

export const FontWeightVariations: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Отображает вариации fontWeight (regular, medium, bold) для вариантов body1 и body2.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <Typography variant="body1" fontWeight="regular">
          Body1 - Regular (400)
        </Typography>
        <Typography variant="body1" fontWeight="medium">
          Body1 - Medium (500)
        </Typography>
        <Typography variant="body1" fontWeight="bold">
          Body1 - Bold (700)
        </Typography>
      </div>

      <div>
        <Typography variant="body2" fontWeight="regular">
          Body2 - Regular (400)
        </Typography>
        <Typography variant="body2" fontWeight="bold">
          Body2 - Bold (700)
        </Typography>
      </div>
    </div>
  ),
}
