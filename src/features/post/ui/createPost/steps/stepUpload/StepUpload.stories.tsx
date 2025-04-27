import { StepUpload } from './StepUpload'
import type { Meta } from '@storybook/react'

const meta = {
  title: 'features/post/StepUpload',
  component: StepUpload,
  tags: ['autodocs'],
} satisfies Meta<typeof StepUpload>

export default meta

export const Default = {
  args: {
    onClose: () => alert('Close'),
  },
}
