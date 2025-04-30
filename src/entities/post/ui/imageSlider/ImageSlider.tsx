'use client'

import { useState, useEffect, useRef, ReactNode, CSSProperties } from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import styles from './ImageSlider.module.css'

type Props = {
  images: {
    src: string
    alt: string
  }[]
  aspectRatio?: 'square' | 'wide' | 'tall'
  className?: string
  onSlideChange?: (index: number) => void
  initialSlide?: number
  showControls?: boolean
  showPagination?: boolean
  showCounter?: boolean
  renderCustomControls?: () => ReactNode
  buttonSize?: number
  buttonClassName?: string
  buttonRadius?: number
  buttonBackgroundColor?: string
}

export const ImageSlider = ({
  images,
  aspectRatio = 'square',
  className = '',
  onSlideChange,
  initialSlide = 0,
  showControls = true,
  showPagination = true,
  showCounter = true,
  renderCustomControls,
  buttonSize = 24,
  buttonClassName = '',
  buttonRadius,
  buttonBackgroundColor,
}: Props) => {
  const [activeIndex, setActiveIndex] = useState(initialSlide)
  const [isBeginning, setIsBeginning] = useState(true)
  const [isEnd, setIsEnd] = useState(false)
  const swiperRef = useRef<SwiperType | null>(null)

  const buttonStyle = {
    ...(buttonRadius !== undefined && { '--button-radius': `${buttonRadius}px` }),
    ...(buttonBackgroundColor && { '--button-bg-color': buttonBackgroundColor }),
  } as CSSProperties

  if (!images || images.length === 0) {
    return null
  }

  if (images.length === 1) {
    return (
      <div className={`${styles.container} ${styles[aspectRatio]} ${className}`}>
        <div className={styles.singleImage}>
          <Image src={images[0].src} alt={images[0].alt} fill className={styles.image} />
        </div>
      </div>
    )
  }

  const handleSlideChange = (swiper: SwiperType) => {
    const newIndex = swiper.activeIndex
    setActiveIndex(newIndex)
    setIsBeginning(swiper.isBeginning)
    setIsEnd(swiper.isEnd)
    if (onSlideChange) {
      onSlideChange(newIndex)
    }
  }

  useEffect(() => {
    if (swiperRef.current) {
      setIsBeginning(swiperRef.current.isBeginning)
      setIsEnd(swiperRef.current.isEnd)
    }
  }, [swiperRef.current])

  return (
    <div className={`${styles.container} ${styles[aspectRatio]} ${className}`}>
      <Swiper
        modules={[Navigation, Pagination]}
        onSwiper={(swiper) => {
          swiperRef.current = swiper
          setIsBeginning(swiper.isBeginning)
          setIsEnd(swiper.isEnd)
        }}
        initialSlide={initialSlide}
        onSlideChange={handleSlideChange}
        navigation={false}
        pagination={
          showPagination
            ? {
                clickable: true,
                type: 'bullets',
                bulletActiveClass: `${styles.bulletActive}`,
                bulletClass: `${styles.bullet}`,
              }
            : false
        }
        className={styles.swiper}
      >
        {images.map((image, index) => (
          <SwiperSlide key={`slide-${index}`}>
            <div className={styles.slideContent}>
              <Image src={image.src} alt={image.alt} fill className={styles.image} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {showControls && (
        <>
          <button
            type="button"
            className={`${styles.navButton} ${styles.prevButton} ${isBeginning ? styles.disabled : ''} ${buttonClassName}`}
            aria-label="Previous image"
            style={buttonStyle}
            onClick={() => {
              if (!isBeginning && swiperRef.current) {
                swiperRef.current.slidePrev()
              }
            }}
          >
            <IoChevronBackOutline size={buttonSize} />
          </button>
          <button
            type="button"
            className={`${styles.navButton} ${styles.nextButton} ${isEnd ? styles.disabled : ''} ${buttonClassName}`}
            aria-label="Next image"
            style={buttonStyle}
            onClick={() => {
              if (!isEnd && swiperRef.current) {
                swiperRef.current.slideNext()
              }
            }}
          >
            <IoChevronForwardOutline size={buttonSize} />
          </button>
        </>
      )}

      {showCounter && (
        <div className={styles.counter}>
          {activeIndex + 1} / {images.length}
        </div>
      )}

      {renderCustomControls && renderCustomControls()}
    </div>
  )
}
