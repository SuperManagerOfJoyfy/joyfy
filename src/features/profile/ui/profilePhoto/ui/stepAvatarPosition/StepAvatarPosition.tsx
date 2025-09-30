'use client'

import Cropper, { Area } from 'react-easy-crop'
import { useCallback, useState } from 'react'
import { getCroppedImg } from '@/features/profile/utils/getCroppedImg'
import { useUploadProfileAvatarMutation } from '@/features/profile/api/profileApi'
import s from './StepAvatarPosition.module.scss'
import { Button } from '@/shared/ui/button'
import { toast } from 'react-toastify'
import { useTranslations } from 'next-intl'

type StepAvatarPositionProps = {
  imageSrc: string
  onUpload: () => void
}

export const StepAvatarPosition = ({ imageSrc, onUpload }: StepAvatarPositionProps) => {
  const t = useTranslations('avatar')

  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [uploadAvatar, { isLoading }] = useUploadProfileAvatarMutation()

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleUpload = async () => {
    if (!imageSrc || !croppedAreaPixels) return

    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels)
      const formData = new FormData()
      formData.append('file', croppedBlob, 'avatar')
      await uploadAvatar(formData).unwrap()
      toast.success(t('uploadSuccess'))
      onUpload()
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
        <Button onClick={handleUpload} disabled={isLoading}>
          {t('saveButton')}
        </Button>
      </div>
    </div>
  )
}
