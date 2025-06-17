import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { usePostModalContext } from '../context/PostModalContext'

export const PostModalHeaderMeta = () => {
  const { currentPost } = usePostModalContext()
  const { userName, description } = currentPost

  return (
    <VisuallyHidden>
      <DialogTitle>{`${userName} post`}</DialogTitle>
      <DialogDescription>{description}</DialogDescription>
    </VisuallyHidden>
  )
}
