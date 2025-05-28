import { ImageItem, usePostContext } from '@/features/post/ui/createPost/providers'
import Cropper, { Area } from 'react-easy-crop'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { getCroppedImg } from '@/features/profile/ui/profilePhoto/ui/getCroppedImg'
import { useUploadProfileAvatarMutation } from '@/features/profile/api/profileApi'
import s from './ProfilePhoto.module.scss'
import { Button } from '@/shared/ui/button'
import { toast } from 'react-toastify'

export const StepAvatarPosition = ({ onClose }: { onClose: () => void }) => {
  const { images, currentImageIdx, clearAll } = usePostContext()
  const imageSrc = images[currentImageIdx]?.src

  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [uploadAvatar] = useUploadProfileAvatarMutation()

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    console.log('croppedAreaPixels13', croppedAreaPixels)
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])
  console.log('croppedAreaPixels', croppedAreaPixels)

  const handleUpload = async () => {
    if (!imageSrc || !croppedAreaPixels) return

    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels)
      const formData = new FormData()
      formData.append('file', croppedBlob, 'avatar')
      await uploadAvatar(formData).unwrap()
      toast.success('Avatar uploaded successfully')
      onClose()
      clearAll()
    } catch (e) {
      console.error('Upload failed:', e)
    }
  }

  return (
    <div className={s.cropModalContent}>
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
          objectFit="cover"
          cropSize={{ width: 316, height: 316 }}
          classes={{ cropAreaClassName: s.cropArea }}
        />
      </div>
      <div className={s.controlsWrapper}>
        <Button onClick={handleUpload}>Save</Button>
      </div>
    </div>
  )
}
