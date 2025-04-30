'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/shared/ui'
import { AspectRatioType, FILTERS, FilterType } from '@/features/post/types/types'
import { ImageSlider } from '@/entities/post/ui/imageSlider'

import s from './StepFilters.module.css'

type StepFiltersProps = {
  files: File[]
  imagePreviews: string[]
  currentImageIndex: number
  onImageIndexChange: (index: number) => void
  onPrevImage: () => void
  onNextImage: () => void
  aspectRatio: AspectRatioType
  zoom: number
  onBack: () => void
  onNext: () => void
  initialFilter: FilterType
  onFilterChange: (filter: FilterType) => void
}

export const StepFilters = ({
  files,
  imagePreviews,
  currentImageIndex,
  onImageIndexChange,
  onPrevImage,
  onNextImage,
  aspectRatio,
  zoom,
  onBack,
  onNext,
  initialFilter,
  onFilterChange,
}: StepFiltersProps) => {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>(initialFilter)

  const handleFilterSelect = (filter: FilterType) => {
    setSelectedFilter(filter)
    onFilterChange(filter)
  }

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case '1:1':
        return s.square
      case '4:5':
        return s.portrait
      case '16:9':
        return s.landscape
      default:
        return s.square
    }
  }

  const previewImages = imagePreviews.map((src, index) => ({
    src,
    alt: `Preview ${index + 1}`,
  }))

  const sliderClassName = `${s.slider} ${s[selectedFilter.toLowerCase()]}`

  return (
    <div className={s.root}>
      <div className={s.container}>
        <div className={s.previewContainer}>
          <div className={`${s.imageWrapper} ${getAspectRatioClass()}`} style={{ transform: `scale(${zoom})` }}>
            <ImageSlider
              images={previewImages}
              aspectRatio={aspectRatio === '1:1' ? 'square' : aspectRatio === '4:5' ? 'tall' : 'wide'}
              initialSlide={currentImageIndex}
              onSlideChange={onImageIndexChange}
              showControls={true}
              showPagination={true}
              showCounter={true}
            />
          </div>
        </div>

        <div className={s.filtersContainer}>
          <div className={s.filtersGrid}>
            {FILTERS.map((filter) => (
              <div
                key={filter}
                className={`${s.filterItem} ${selectedFilter === filter ? s.active : ''}`}
                onClick={() => handleFilterSelect(filter)}
                role="button"
                tabIndex={0}
                aria-label={`${filter} filter`}
                aria-selected={selectedFilter === filter}
              >
                {imagePreviews[currentImageIndex] && (
                  <div className={s.filterPreview}>
                    <Image
                      src={imagePreviews[currentImageIndex]}
                      alt={filter}
                      width={80}
                      height={80}
                      className={`${s[filter.toLowerCase()]}`}
                    />
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
