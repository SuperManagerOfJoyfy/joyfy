import { ImageItem, usePostContext } from '@/features/post/ui/createPost/providers'
import Cropper, { Area } from 'react-easy-crop'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { getCroppedImg } from '@/features/profile/ui/profilePhoto/ui/getCroppedImg'
import { useUploadProfileAvatarMutation } from '@/features/profile/api/profileApi'
import s from './ProfilePhoto.module.scss'
import { Button } from '@/shared/ui/button'

export const StepAvatarPosition = () => {
  const { images, currentImageIdx, setImagesPreview, imagesBlob } = usePostContext()
  const imageSrc = images[currentImageIdx]?.src

  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [uploadAvatar] = useUploadProfileAvatarMutation()
  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleUpload = async () => {
    if (!imageSrc || !croppedAreaPixels) return

    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels)

      const formData = new FormData()
      const res = formData.append('file', croppedBlob, 'avatar.jpg') // имя файла важно только для читаемости
      console.log(res)

      // const response = await uploadAvatar(res).unwrap()
    } catch (e) {
      console.error('Upload failed:', e)
    }
  }

  return (
    <div className={s.container}>
      <div className={s.crop}>
        <div className={s.cropContainer}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            classes={{ cropAreaClassName: s.cropArea, mediaClassName: s.cropImage }}
          />
        </div>
      </div>
      <div className={s.controlsWrapper}>
        <Button>Save</Button>
      </div>
    </div>
  )
}
