import { AvatarCreationStep, PostCreationStep } from '@/features/post/types/types'
import { FlowType, StepByFlow } from '@/features/post/ui/createPost/createPostModal'

export const getModalTitle = <T extends FlowType>(step: StepByFlow<T>): string => {
  const postTitles: Record<PostCreationStep, string> = {
    upload: 'Add Photo',
    crop: 'Cropping',
    filter: 'Filters',
    description: 'Publication',
  }

  const avatarTitles: Record<AvatarCreationStep, string> = {
    upload: 'Add a Profile Photo',
    position: 'Add a Profile Photo',
  }

  if ((step as PostCreationStep) in postTitles) {
    return postTitles[step as PostCreationStep]
  }
  if ((step as AvatarCreationStep) in avatarTitles) {
    return avatarTitles[step as AvatarCreationStep]
  }
  return 'Add Photo' // fallback
}

export const getModalSize = <T extends FlowType>(step: StepByFlow<T>): 'sm' | 'md' | 'lg' => {
  return step === 'filter' || step === 'description' ? 'lg' : 'md'
}

export const getCardPadding = <T extends FlowType>(step: StepByFlow<T>): 'default' | 'top-only' => {
  return step === 'upload' ? 'default' : 'top-only'
}
