'use client'
import { ModalFlow } from '@/features/imageFlow/types'
import { StepUpload } from '@/features/imageFlow/ui'
import { StepCrop, StepDescription, StepFilters } from '@/features/post/ui/createPost/steps'

const steps = ['upload', 'crop', 'filter', 'description'] as const
export type Step = (typeof steps)[number]

export const createPostFlow = (t: (k: string) => string): ModalFlow<Step> => ({
  steps: [...steps],
  components: {
    upload: StepUpload,
    crop: StepCrop,
    filter: StepFilters,
    description: StepDescription,
  },
  config: {
    upload: {
      title: t('modal.uploadTitle'),
      size: 'md',
      cardPadding: 'default',
      centerTitle: false,
    },
    crop: {
      title: t('modal.cropTitle'),
      size: 'md',
      cardPadding: 'top-only',
      centerTitle: true,
    },
    filter: {
      title: t('modal.filterTitle'),
      size: 'lg',
      cardPadding: 'top-only',
      centerTitle: true,
    },
    description: {
      title: t('modal.descriptionTitle'),
      size: 'lg',
      cardPadding: 'top-only',
      centerTitle: true,
    },
  },
})
