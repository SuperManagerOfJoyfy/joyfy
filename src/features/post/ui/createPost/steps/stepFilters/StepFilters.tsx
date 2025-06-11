'use client'

import Image from 'next/image'

import { FilterType, IMAGE_FILTERS, IMAGE_FILTERS_LIST } from '@/features/post/types/postTypes'
import { ImageSlider } from '@/shared/ui/imageSlider'
import { usePostContext } from '../../providers/PostContext'

import s from './StepFilters.module.scss'

export const StepFilters = () => {
  const { images, imagePreviews, imagesEditData, setImageEditData, setCurrentImageIndex, currentImageIdx } =
    usePostContext()

  const handleFilterSelect = (filter: FilterType) => {
    setImageEditData({ imageFilter: filter })
  }

  const handleSlideChange = (index: number) => {
    setCurrentImageIndex(index)
  }

  const previewImages = imagePreviews.map((src, index) => ({
    src,
    alt: `Preview ${index + 1}`,
  }))

  const currentFilter = imagesEditData[currentImageIdx]?.imageFilter || 'Normal'

  return (
    <div className={s.root}>
      <div className={s.container}>
        <div className={s.previewContainer}>
          <ImageSlider
            images={previewImages}
            initialSlide={currentImageIdx}
            onSlideChange={handleSlideChange}
            showControls={imagePreviews.length > 1}
            showPagination={imagePreviews.length > 1}
            className={s.imageSlider}
          />
        </div>

        <div className={s.filtersContainer}>
          <div className={s.filtersGrid}>
            {IMAGE_FILTERS_LIST.map((filter) => (
              <div
                key={filter}
                className={`${s.filterItem} ${currentFilter === filter ? s.active : ''}`}
                onClick={() => handleFilterSelect(filter)}
                role="button"
                tabIndex={0}
                aria-label={`${filter} filter`}
                aria-selected={currentFilter === filter}
              >
                {images[currentImageIdx]?.src && filter && (
                  <div className={s.filterPreview}>
                    <div className={s.filterImageWrapper}>
                      <Image
                        src={images[currentImageIdx].src}
                        alt={filter}
                        width={80}
                        height={80}
                        className={s.previewThumbnail}
                        style={{ filter: IMAGE_FILTERS[filter] }}
                      />
                    </div>
                  </div>
                )}
                <span className={s.filterName}>{filter}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
