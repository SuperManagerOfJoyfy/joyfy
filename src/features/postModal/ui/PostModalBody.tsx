import { usePostModalContext } from '../context/PostModalContext'
import { PostEditForm } from '../postEditMode'

import { PostViewContent } from '../postViewMode'
import s from './PostModal.module.scss'

export const PostModalBody = () => {
  const {
    isEditing,
    currentPost,
    postId,
    setHasFormChanges,
    handleEditSave,
    handleCancelEdit,
    handleEdit,
    setConfirmAction,
    handleFollowToggle,
    handleCopyLink,
    isOwnPost,
    isFollowing,
  } = usePostModalContext()

  const { description, ownerId, userName, avatarOwner } = currentPost
  const user = { id: ownerId, userName, avatar: avatarOwner }

  return (
    <div className={s.mainContentWrapper}>
      {isEditing ? (
        <PostEditForm
          user={user}
          defaultDescription={description}
          postId={postId}
          onCancelEdit={handleCancelEdit}
          onSaveEdit={handleEditSave}
          onFormChange={setHasFormChanges}
        />
      ) : (
        <PostViewContent
          post={currentPost}
          onEdit={handleEdit}
          onDelete={() => setConfirmAction('delete')}
          isOwnPost={isOwnPost}
          isFollowing={isFollowing}
          onFollowToggle={handleFollowToggle}
          onCopyLink={handleCopyLink}
        />
      )}
    </div>
  )
}
