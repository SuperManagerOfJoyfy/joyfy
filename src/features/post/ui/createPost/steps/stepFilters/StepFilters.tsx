'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/shared/ui'
import { AspectRatioType, FILTERS, FilterType } from '@/features/post/types/types'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

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
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null)

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

  const handleSlideChange = (swiper: SwiperType) => {
    onImageIndexChange(swiper.activeIndex)
  }

  return (
    <div className={s.root}>
      <div className={s.buttons}>
        <Button onClick={onBack} variant="outline" className={s.button} fullWidth>
          Back
        </Button>
        <Button onClick={onNext} variant="primary" className={s.button} fullWidth>
          Next
        </Button>
      </div>

      <div className={s.container}>
        <div className={s.previewContainer}>
          <div className={`${s.imageWrapper} ${getAspectRatioClass()}`}>
            <Swiper
              modules={[Navigation, Pagination]}
              onSwiper={setSwiperInstance}
              initialSlide={currentImageIndex}
              onSlideChange={handleSlideChange}
              className={s.swiper}
              navigation={true}
              pagination={{
                clickable: true,
                type: 'bullets',
              }}
            >
              {imagePreviews.map((src, index) => (
                <SwiperSlide key={`slide-${index}`}>
                  <div className={s.imageContainer} style={{ transform: `scale(${zoom})` }}>
                    <Image
                      src={src}
                      alt={`Preview ${index + 1}`}
                      width={500}
                      height={500}
                      className={`${s.preview} ${s[selectedFilter.toLowerCase()]}`}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
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
