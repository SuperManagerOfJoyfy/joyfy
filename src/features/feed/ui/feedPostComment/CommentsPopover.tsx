import * as Dialog from '@radix-ui/react-dialog'
import { useGetMeQuery } from '@/features/auth/api/authApi'
import { PostCommentList } from '@/features/comments/ui'
import { PostCommentForm } from '@/features/comments/ui/PostCommentForm'
import s from './CommentsPopover.module.scss'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

type Props = {
  postId: number
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export const CommentsPopover = ({ postId, open, onOpenChange }: Props) => {
  const { data: me } = useGetMeQuery()

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={s.overlay} />
        <VisuallyHidden>
          <Dialog.DialogDescription>Post comments. Add a comment.</Dialog.DialogDescription>
        </VisuallyHidden>
        <Dialog.Content className={s.dialogContent}>
          <div className={s.popoverHeader}>
            <Dialog.Title className={s.popoverTitle}>Comments</Dialog.Title>
          </div>

          <div className={s.commentsContainer}>
            <PostCommentList postId={postId} userId={me?.userId} />
          </div>

          <div className={s.commentFormContainer}>
            <PostCommentForm postId={postId} />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
