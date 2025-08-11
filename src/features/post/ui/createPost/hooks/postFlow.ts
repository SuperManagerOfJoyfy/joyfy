import { ModalFlow } from '@/features/imageFlow/types'
import { StepUpload } from '@/features/imageFlow/ui'
import { StepCrop, StepDescription, StepFilters } from '@/features/post/ui/createPost/steps'

const steps = ['upload', 'crop', 'filter', 'description'] as const

export type Step = (typeof steps)[number]

export const createPostFlow = (): ModalFlow<Step> => ({
  steps: [...steps],
  components: {
    upload: StepUpload,
    crop: StepCrop,
    filter: StepFilters,
    description: StepDescription,
  },
  config: {
    upload: {
      title: 'Add Photo',
      size: 'md',
      cardPadding: 'default',
      centerTitle: false,
    },
    crop: {
      title: 'Cropping',
      size: 'md',
      cardPadding: 'top-only',
      centerTitle: true,
    },
    filter: {
      title: 'Filters',
      size: 'lg',
      cardPadding: 'top-only',
      centerTitle: true,
    },
    description: {
      title: 'Publication',
      size: 'lg',
      cardPadding: 'top-only',
      centerTitle: true,
    },
  },
})
