import { usePostModalContext } from '@/features/post/context'
import { PostDisplay, PostEditForm } from '@/features/post/ui/postModal'
import s from './PostModalLayout.module.scss'
import { ImageSlider } from '@/shared/ui'

export const PostModalLayout = () => {
  const {
    currentPost,
    isEditing,
    isOwnPost,
    isFollowing,
    postId,
    handleEdit,
    handleFollowToggle,
    handleCopyLink,
    handleCancelEdit,
    handleEditSave,
    setHasFormChanges,
    setConfirmAction,
  } = usePostModalContext()

  const { userName, ownerId, avatarOwner, description, images } = currentPost

  return (
    <div className={s.container}>
      <div className={s.imageWrapper}>
        <ImageSlider
          images={images.map((img: any, idx: number) => ({
            src: img.url,
            alt: `Post image ${idx + 1}`,
          }))}
        />
      </div>

      <div className={s.contentWrapper}>
        {isEditing ? (
          <PostEditForm
            user={{ id: ownerId, userName, avatar: avatarOwner }}
            defaultDescription={description}
            postId={postId}
            onCancelEdit={handleCancelEdit}
            onSaveEdit={handleEditSave}
            onFormChange={setHasFormChanges}
          />
        ) : (
          <PostDisplay
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
    </div>
  )
}
