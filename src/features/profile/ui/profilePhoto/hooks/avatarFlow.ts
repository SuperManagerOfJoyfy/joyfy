import { ModalFlow } from '@/features/imageFlow/types'
import { StepUpload } from '@/features/imageFlow/ui'
import { StepAvatarPosition } from '@/features/profile/ui/profilePhoto/ui/stepAvatarPosition/StepAvatarPosition'

export const createAvatarFlow = (): ModalFlow => ({
  steps: ['avatar-upload', 'avatar-position'],
  components: {
    'avatar-upload': StepUpload,
    'avatar-position': StepAvatarPosition,
  },
  config: {
    'avatar-upload': {
      title: 'Add Profile Photo',
      size: 'md',
      cardPadding: 'default',
      centerTitle: false,
    },
    'avatar-position': {
      title: 'Crop Profile Photo',
      size: 'md',
      cardPadding: 'top-only',
      centerTitle: true,
    },
  },
})
