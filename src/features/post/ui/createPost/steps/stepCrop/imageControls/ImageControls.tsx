'use client'

import { FiZoomIn } from 'react-icons/fi'
import { TbAspectRatio, TbSquare, TbRectangleVertical, TbRectangle } from 'react-icons/tb'
import { ChangeEvent, useState } from 'react'
import clsx from 'clsx'

import { AspectRatioType } from '@/features/post/types/types'
import { Button } from '@/shared/ui'
import { StepCropAddPhoto } from '../stepCropAddPhoto/StepCropAddPhoto'
import { usePostContext } from '../../../providers'
import { useOutsideClick } from '@/shared/hooks/useOutsideClick'

import s from '../StepCrop.module.scss'

enum EShowControl {
  inactive,
  aspectRatio,
  zoom,
  addPhoto,
}

export const ImageControls = () => {
  const { imagePreviews, imagesEditData, currentImageIdx, addImage, resetToOriginal, removeImage, setImageEditData } =
    usePostContext()

  const [activeShowControl, setActiveControl] = useState<EShowControl>(EShowControl.inactive)

  const { ref } = useOutsideClick<HTMLDivElement>(() => setActiveControl(EShowControl.inactive))

  const handleZoomChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newZoom = parseFloat(e.target.value)
    setImageEditData({ scale: newZoom })
  }

  const handleAspectRatioChange = (ratio: AspectRatioType) => {
    setImageEditData({ aspectRatio: ratio })
  }

  const handleAddMorePhotos = (files: File[]) => {
    if (files.length > 0) {
      addImage(files)
    }
  }

  const handleShowControl = (showControlName: EShowControl) => () => {
    Object.values(EShowControl).forEach((item) => {
      if (showControlName === item && activeShowControl !== showControlName) {
        setActiveControl(showControlName)
      }
      if (showControlName === item && activeShowControl === showControlName) {
        setActiveControl(EShowControl.inactive)
      }
    })
  }

  return (
    <div className={s.controls} ref={ref}>
      <div className={s.controlContainer}>
        <div className={s.controlItem}>
          <Button
            variant="text"
            customStyles={true}
            noPadding={true}
            className={`${s.controlButton} ${activeShowControl === EShowControl.aspectRatio ? s.active : ''}`}
            onClick={handleShowControl(EShowControl.aspectRatio)}
            type="button"
          >
            <div className={s.iconSquare}>
              <TbAspectRatio size={20} />
            </div>
          </Button>
          <div className={`${s.expandedControl} ${activeShowControl === EShowControl.aspectRatio ? s.show : ''}`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Button
                variant="text"
                noPadding={true}
                customStyles={true}
                className={clsx(s.aspectRatioOption, {
                  [s.active]: imagesEditData[currentImageIdx]?.aspectRatio === 'original',
                })}
                onClick={() => resetToOriginal(currentImageIdx)}
              >
                <div className={s.buttonSelect}>
                  <span className={s.label}>Оригинал</span>
                  <TbAspectRatio size={20} className={s.icon} />
                </div>
              </Button>

              <Button
                variant="text"
                noPadding={true}
                customStyles={true}
                className={clsx(s.aspectRatioOption, {
                  [s.active]: imagesEditData[currentImageIdx]?.aspectRatio === '1:1',
                })}
                onClick={() => handleAspectRatioChange('1:1')}
              >
                <div className={s.buttonSelect}>
                  <span className={s.label}>1:1</span>
                  <TbSquare size={20} className={s.icon} />
                </div>
              </Button>

              <Button
                variant="text"
                noPadding={true}
                customStyles={true}
                className={clsx(s.aspectRatioOption, {
                  [s.active]: imagesEditData[currentImageIdx]?.aspectRatio === '4:5',
                })}
                onClick={() => handleAspectRatioChange('4:5')}
              >
                <div className={s.buttonSelect}>
                  <span className={s.label}>4:5</span>
                  <TbRectangleVertical size={20} className={s.icon} />
                </div>
              </Button>

              <Button
                variant="text"
                noPadding={true}
                customStyles={true}
                className={clsx(s.aspectRatioOption, {
                  [s.active]: imagesEditData[currentImageIdx]?.aspectRatio === '16:9',
                })}
                onClick={() => handleAspectRatioChange('16:9')}
              >
                <div className={s.buttonSelect}>
                  <span className={s.label}>16:9</span>
                  <TbRectangle size={20} className={s.icon} />
                </div>
              </Button>
            </div>
          </div>
        </div>

        <div className={s.controlItem}>
          <Button
            variant="icon"
            className={`${s.controlButton} ${activeShowControl === EShowControl.zoom ? s.active : ''}`}
            onClick={handleShowControl(EShowControl.zoom)}
            type="button"
          >
            <div className={s.iconSquare}>
              <FiZoomIn size={20} />
            </div>
          </Button>
          <div className={`${s.expandedControl} ${activeShowControl === EShowControl.zoom && s.show}`}>
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={imagesEditData[currentImageIdx]?.scale}
              onChange={handleZoomChange}
              className={s.zoomSlider}
            />
          </div>
        </div>
      </div>

      <div className={s.controlItem}>
        <div className={s.iconSquare}>
          <StepCropAddPhoto
            onRemoveImage={removeImage}
            isShowMenu={activeShowControl === EShowControl.addPhoto}
            onShowMenu={handleShowControl(EShowControl.addPhoto)}
            onFilesSelected={handleAddMorePhotos}
            images={imagePreviews}
          />
        </div>
      </div>
    </div>
  )
}
