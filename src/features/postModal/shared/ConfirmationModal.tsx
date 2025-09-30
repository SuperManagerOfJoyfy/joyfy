import { ConfirmModal } from '@/shared/ui'
import { usePostModalContext } from '../context/PostModalContext'
import { useTranslations } from 'next-intl'

export const ConfirmationModal = () => {
  const { confirmAction, setConfirmAction, handleConfirmAction } = usePostModalContext()
  const t = useTranslations('postEditForm')

  const getModalContent = () => {
    switch (confirmAction) {
      case 'delete':
        return {
          title: t('menu.delete'),
          description: t('confirmDelete'),
        }
      case 'cancelEdit':
        return {
          title: t('cancel'),
          description: t('confirmCancel'),
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
