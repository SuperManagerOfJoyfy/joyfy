import type { Meta, StoryObj } from '@storybook/react'
import { ImageSlider } from './ImageSlider'

const meta: Meta<typeof ImageSlider> = {
  title: 'entities/ImageSlider',
  component: ImageSlider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    showControls: {
      control: 'boolean',
    },
    showPagination: {
      control: 'boolean',
    },
    showCounter: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof ImageSlider>

const sampleImages = [
  {
    src: 'https://picsum.photos/id/1018/1000/600',
    alt: 'Mountain landscape',
  },
  {
    src: 'https://picsum.photos/id/1015/1000/600',
    alt: 'River in mountains',
  },
  {
    src: 'https://picsum.photos/id/1016/1000/600',
    alt: 'Foggy mountains',
  },
  {
    src: 'https://picsum.photos/id/1019/1000/600',
    alt: 'Nature landscape',
  },
]

export const Default: Story = {
  render: (args) => (
    <div style={{ display: 'flex', overflow: 'hidden', width: '400px', height: '400px' }}>
      <ImageSlider {...args} />
    </div>
  ),
  args: {
    images: sampleImages,
    showControls: true,
    showPagination: true,
    showCounter: true,
  },
}
