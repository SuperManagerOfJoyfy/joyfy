'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/shared/ui'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { AspectRatioType, FILTERS, FilterType } from '@/features/post/types/types'

import s from './StepFilters.module.css'

type StepFiltersProps = {
  files: File[]
  aspectRatio: AspectRatioType
  zoom: number
  onBack: () => void
  onNext: (files: File[], filter: FilterType) => void
  initialFilter?: FilterType
}

export const StepFilters = ({
  files,
  aspectRatio,
  zoom,
  onBack,
  onNext,
  initialFilter = 'Normal',
}: StepFiltersProps) => {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>(initialFilter)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  useEffect(() => {
    const previews = files.map((file) => URL.createObjectURL(file))
    setImagePreviews(previews)

    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview))
    }
  }, [files])

  const handleFilterSelect = (filter: FilterType) => {
    setSelectedFilter(filter)
  }

  const handleNext = () => {
    onNext(files, selectedFilter)
  }

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1)
    }
  }

  const handleNextImage = () => {
    if (currentImageIndex < files.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1)
    }
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

  return (
    <div className={s.container}>
      <div className={s.previewContainer}>
        {files.length > 1 && (
          <div className={s.navigationControls}>
            <button onClick={handlePrevImage} disabled={currentImageIndex === 0} className={s.navButton} type="button">
              <FiChevronLeft size={20} />
            </button>
            <button
              onClick={handleNextImage}
              disabled={currentImageIndex === files.length - 1}
              className={s.navButton}
              type="button"
            >
              <FiChevronRight size={20} />
            </button>
          </div>
        )}

        <div className={`${s.imageWrapper} ${getAspectRatioClass()}`}>
          {imagePreviews[currentImageIndex] && (
            <div className={s.imageContainer} style={{ transform: `scale(${zoom})` }}>
              <Image
                src={imagePreviews[currentImageIndex]}
                alt={`Preview ${currentImageIndex + 1}`}
                width={500}
                height={500}
                className={`${s.preview} ${s[selectedFilter.toLowerCase()]}`}
              />
            </div>
          )}
        </div>

        {files.length > 1 && (
          <div className={s.pagination}>
            {files.map((_, idx) => (
              <div
                key={`indicator-${idx}`}
                className={`${s.paginationDot} ${idx === currentImageIndex ? s.active : ''}`}
                onClick={() => setCurrentImageIndex(idx)}
                role="button"
                tabIndex={0}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        )}
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

      <div className={s.buttons}>
        <Button onClick={onBack} variant="outline" className={s.button} fullWidth>
          Back
        </Button>
        <Button onClick={handleNext} variant="primary" className={s.button} fullWidth>
          Next
        </Button>
      </div>
    </div>
  )
}
