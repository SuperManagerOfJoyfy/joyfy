import { PostCreationStep } from '@/features/post/types/types'

export const getModalTitle = (step: PostCreationStep): string => {
  const titles: Record<PostCreationStep, string> = {
    upload: 'Add Photo',
    crop: 'Cropping',
    filter: 'Filters',
    description: 'Publication',
  }
  return titles[step] ?? 'Add Photo'
}

export const getModalSize = (step: PostCreationStep): 'sm' | 'md' | 'lg' => {
  return step === 'filter' || step === 'description' ? 'lg' : 'md'
}

export const getCardPadding = (step: PostCreationStep): 'default' | 'top-only' => {
  return step === 'upload' ? 'default' : 'top-only'
}
