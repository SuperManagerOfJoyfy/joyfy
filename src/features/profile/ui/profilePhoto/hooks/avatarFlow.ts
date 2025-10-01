'use client'

import { ModalFlow } from '@/features/imageFlow/types'
import { StepUpload } from '@/features/imageFlow/ui'
import { StepAvatarPosition } from '@/features/profile/ui/profilePhoto/ui/stepAvatarPosition/StepAvatarPosition'

export const createAvatarFlow = (t: (key: string) => string): ModalFlow => ({
  steps: ['avatar-upload', 'avatar-position'],
  components: {
    'avatar-upload': StepUpload,
    'avatar-position': StepAvatarPosition,
  },
  config: {
    'avatar-upload': {
      title: t('avatar.modal.uploadTitle'),
      size: 'md',
      cardPadding: 'default',
      centerTitle: false,
    },
    'avatar-position': {
      title: t('avatar.modal.positionTitle'),
      size: 'md',
      cardPadding: 'top-only',
      centerTitle: true,
    },
  },
})
