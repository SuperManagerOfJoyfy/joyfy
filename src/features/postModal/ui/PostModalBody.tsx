import { usePostModalContext } from '../context/PostModalContext'
import { PostEditForm } from '../postEditMode'

import { PostContent } from '../postViewMode'
import s from './PostModal.module.scss'

export const PostModalBody = () => {
  const {
    isEditing,
    isUpdating,
    isOwnPost,
    isFollowing,
    currentPost,
    postId,
    setHasFormChanges,
    savePostChanges,
    handleCancelEdit,
    handleEdit,
    setConfirmAction,
    handleFollowToggle,
    handleCopyLink,
  } = usePostModalContext()

  const { description, ownerId, userName, avatarOwner } = currentPost
  const user = { id: ownerId, userName, avatar: avatarOwner }

  return (
    <div className={s.mainContentWrapper}>
      {isEditing ? (
        <PostEditForm
          user={user}
          initialDescription={description}
          postId={postId}
          onCancelEdit={handleCancelEdit}
          onSave={savePostChanges}
          isSaving={isUpdating}
          onFormChange={setHasFormChanges}
        />
      ) : (
        <PostContent
          post={currentPost}
          isOwnPost={isOwnPost}
          isFollowing={isFollowing}
          onEdit={handleEdit}
          onDelete={() => setConfirmAction('delete')}
          onFollowToggle={handleFollowToggle}
          onCopyLink={handleCopyLink}
        />
      )}
    </div>
  )
}
