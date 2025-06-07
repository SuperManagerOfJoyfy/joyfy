import { PostCreationStep } from '@/features/post/types/postTypes'

export type ModalStep = PostCreationStep | 'avatar-upload' | 'avatar-position'

export type ModalConfig = {
  title: string
  size: 'sm' | 'md' | 'lg'
  cardPadding: 'default' | 'top-only'
  centerTitle: boolean
}

const POST_MODAL_CONFIG: Record<PostCreationStep, ModalConfig> = {
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
}

const AVATAR_MODAL_CONFIG = {
  'avatar-upload': {
    title: 'Add Profile Photo',
    size: 'md' as const,
    cardPadding: 'default' as const,
    centerTitle: false,
  },
  'avatar-position': {
    title: 'Crop Profile Photo',
    size: 'md' as const,
    cardPadding: 'top-only' as const,
    centerTitle: true,
  },
}

export const getModalConfig = (step: ModalStep): ModalConfig => {
  if (step in POST_MODAL_CONFIG) {
    return POST_MODAL_CONFIG[step as PostCreationStep]
  }

  if (step in AVATAR_MODAL_CONFIG) {
    return AVATAR_MODAL_CONFIG[step as keyof typeof AVATAR_MODAL_CONFIG]
  }

  return {
    title: 'Modal',
    size: 'md',
    cardPadding: 'default',
    centerTitle: true,
  }
}

export const getModalTitle = (step: ModalStep): string => {
  return getModalConfig(step).title
}

export const getModalSize = (step: ModalStep): 'sm' | 'md' | 'lg' => {
  return getModalConfig(step).size
}

export const getCardPadding = (step: ModalStep): 'default' | 'top-only' => {
  return getModalConfig(step).cardPadding
}

export const getCenterTitle = (step: ModalStep): boolean => {
  return getModalConfig(step).centerTitle
}
