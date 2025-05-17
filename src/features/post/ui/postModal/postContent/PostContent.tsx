import { PostItem as PostItemType } from '@/features/post/types/types'
import { PostDropdownMenuItems } from '@/features/post/ui/postModal/postDropdownMenuItems'
import { DropdownMenu, Scroll, Separator, UserCard } from '@/shared/ui'
import { HiDotsHorizontal } from 'react-icons/hi'
import { PostActions } from '../postActions'
import { PostItem } from '../postItem'
import s from './PostContent.module.scss'

type Props = {
  post: PostItemType
  isOwnPost: boolean
  isFollowing: boolean
  onEdit: () => void
  onDelete: () => void
  onFollowToggle: () => void
  onCopyLink: () => void
}

export const PostContent = ({ post, isOwnPost, isFollowing, onEdit, onDelete, onFollowToggle, onCopyLink }: Props) => {
  const { userName, ownerId, avatarOwner, likesCount, id: postId, createdAt } = post

  return (
    <>
      <div className={s.contentHeader}>
        <UserCard user={{ id: ownerId, userName, avatar: avatarOwner }} />
        <DropdownMenu trigger={<HiDotsHorizontal />}>
          <PostDropdownMenuItems
            isOwnPost={isOwnPost}
            isFollowing={isFollowing}
            onEdit={onEdit}
            onDelete={onDelete}
            onFollowToggle={onFollowToggle}
            onCopyLink={onCopyLink}
          />
        </DropdownMenu>
      </div>
      <Separator />
      <Scroll className={s.scrollArea}>
        <PostItem item={post} />
      </Scroll>
      <Separator />
      <PostActions likesCount={likesCount} postId={postId} date={createdAt} />
    </>
  )
}
