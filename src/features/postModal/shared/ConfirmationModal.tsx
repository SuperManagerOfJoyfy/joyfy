import { ConfirmModal } from '@/shared/ui'
import { usePostModalContext } from '../context/PostModalContext'

export const ConfirmationModal = () => {
  const { confirmAction, setConfirmAction, handleConfirmAction } = usePostModalContext()

  const getModalContent = () => {
    switch (confirmAction) {
      case 'delete':
        return {
          title: 'Delete Post',
          description: 'Are you sure you want to delete this post?',
        }
      case 'cancelEdit':
        return {
          title: 'Cancel Editing',
          description: 'Are you sure you want to exit post editing? Your changes will not be saved.',
        }
      default:
        return { title: '', description: '' }
    }
  }

  const { title, description } = getModalContent()

  return (
    <ConfirmModal
      title={title}
      description={description}
      isOpen={!!confirmAction}
      setIsOpen={() => setConfirmAction(null)}
      onConfirm={handleConfirmAction}
    />
  )
}
