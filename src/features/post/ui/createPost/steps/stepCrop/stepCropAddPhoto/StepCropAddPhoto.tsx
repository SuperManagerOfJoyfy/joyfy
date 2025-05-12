import { FiImage } from 'react-icons/fi'
import Image from 'next/image'
import { FiX } from 'react-icons/fi'

import { MAX_IMAGES } from '@/features/post/utils/constats'
import { Button, Scroll } from '@/shared/ui'
import { ImageUploadButton } from '../imageUploadButton/ImageUploadButton'

import s from '../StepCrop.module.scss'

type StepCropAddPhotoProps = {
  isShowMenu: boolean
  images: string[]
  onShowMenu: () => void
  onRemoveImage: (idx: number) => void
  onFilesSelected: (files: File[]) => void
}

export const StepCropAddPhoto = ({
  onShowMenu,
  onFilesSelected,
  onRemoveImage,
  isShowMenu,
  images,
}: StepCropAddPhotoProps) => {
  return (
    <div className={s.controlItem}>
      <Button variant="icon" className={`${s.controlButton} ${isShowMenu ? s.active : ''}`} onClick={onShowMenu}>
        <div className={s.iconSquare}>
          <FiImage size={20} />
        </div>
      </Button>
      <div className={`${s.expandedControl} ${s.right} ${isShowMenu && s.show}`}>
        <Scroll className={`horizontalContainer ${s.container}`}>
          <div className="horizontalContainer">
            <div className={s.wrapper + ' item'}>
              {images.map((image, idx) => (
                <div className={s.addPhotoImgContainer} key={idx}>
                  <Button
                    variant="icon"
                    noPadding={true}
                    className={s.addPhotoImgContainerBtn}
                    onClick={() => onRemoveImage(idx)}
                  >
                    <FiX size={12} />
                  </Button>
                  <Image width={80} height={82} alt="preview" src={image} className={s.imagePreview} />
                </div>
              ))}

              {images.length < MAX_IMAGES && (
                <ImageUploadButton
                  onFilesSelected={onFilesSelected}
                  maxFileSize={10}
                  maxImages={MAX_IMAGES}
                  validateCurrentCount={images.length}
                  iconSize={20}
                  className={s.miniUploader}
                  buttonClassName={s.miniButton}
                />
              )}
            </div>
          </div>
        </Scroll>
      </div>
    </div>
  )
}
