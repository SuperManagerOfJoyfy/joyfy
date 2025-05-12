import { createContext, useContext, useState, ReactNode, useRef, useEffect } from 'react'

import { useCreatePostMutation, useUploadImageMutation } from '@/features/post/api/postsApi'
import { ASPECT_RATIOS, AspectRatioType, FilterType, IMAGE_FILTERS } from '@/features/post/types/types'

export type ImageItem = {
  id: string
  src: string
  originalSrc?: string
}

export type ImageEditData = {
  scale: number
  imageFilter: FilterType
  aspectRatio: AspectRatioType
}

type PostContextType = {
  images: ImageItem[]
  imagesEditData: ImageEditData[]
  imagesBlob: Record<number, Blob>
  imagePreviews: string[]
  description: string
  setCurrentImageIndex: (idx: number) => void
  setDescription: (description: string) => void
  setImageEditData: (imageEditData: Partial<ImageEditData>) => void
  addImage: (blob: File[]) => void
  getImage: (idx: number) => ImageItem | undefined
  removeImage: (idx: number) => void
  clearAll: () => void
  publishPost: () => Promise<void>
  currentImageIdx: number
  resetToOriginal: (idx?: number) => void
}

const PostContext = createContext<PostContextType | null>(null)

export const usePostContext = () => {
  const ctx = useContext(PostContext)
  if (!ctx) throw new Error('PostContext not found')
  return ctx
}

export const PostContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentImageIdx, setCurrentImageIdx] = useState<number>(0)
  const [images, setImages] = useState<ImageItem[]>([])
  const [imagesEditData, setImagesEditData] = useState<ImageEditData[]>([])
  const [imagePreviews, setImagesPreview] = useState<string[]>([])
  const [description, setDescription] = useState('')
  const workCanvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'))
  const displayCanvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'))
  const imagesBlob = useRef<Record<number, Blob>>({})
  const originalImages = useRef<Record<number, string>>({})

  const [uploadImage] = useUploadImageMutation()
  const [createPost] = useCreatePostMutation()

  const getAspectRatio = (aspect: string) => {
    if (aspect === 'original') {
      return 0
    }
    const [w, h] = aspect.split(':').map(Number)
    return w / h
  }

  useEffect(() => {
    if (!images || images.length === 0 || currentImageIdx >= images.length) return

    const img = new Image()
    img.src = images[currentImageIdx].src

    img.onload = () => {
      const displayCanvas = displayCanvasRef.current
      const displayCtx = displayCanvas.getContext('2d')
      const workCanvas = workCanvasRef.current
      const workCtx = workCanvas.getContext('2d')

      if (!displayCtx || !workCtx || !img || !imagesEditData[currentImageIdx]) return

      const currentAspectRatio = imagesEditData[currentImageIdx].aspectRatio
      const aspectRatioValue = getAspectRatio(currentAspectRatio)

      const iw = img.width
      const ih = img.height
      const imageRatio = iw / ih

      let cropX = 0,
        cropY = 0,
        cropW = iw,
        cropH = ih

      if (currentAspectRatio !== 'original') {
        if (imageRatio > aspectRatioValue) {
          cropW = ih * aspectRatioValue
          cropX = (iw - cropW) / 2
        } else {
          cropH = iw / aspectRatioValue
          cropY = (ih - cropH) / 2
        }
      }

      const baseW = 1000
      const baseH = currentAspectRatio === 'original' ? baseW / imageRatio : baseW / aspectRatioValue

      workCanvas.width = baseW
      workCanvas.height = baseH

      workCtx.clearRect(0, 0, baseW, baseH)
      workCtx.filter = IMAGE_FILTERS[imagesEditData[currentImageIdx].imageFilter] || 'none'

      const scaledW = baseW * imagesEditData[currentImageIdx].scale
      const scaledH = baseH * imagesEditData[currentImageIdx].scale
      const offsetX = (baseW - scaledW) / 2
      const offsetY = (baseH - scaledH) / 2

      if (img.complete && img.naturalWidth > 0) {
        workCtx.filter = IMAGE_FILTERS[imagesEditData[currentImageIdx].imageFilter] || 'none'
        workCtx.drawImage(img, cropX, cropY, cropW, cropH, offsetX, offsetY, scaledW, scaledH)
      } else {
        console.error('Image not ready for drawing')
        return
      }

      const previewW = 1000
      const previewH = currentAspectRatio === 'original' ? previewW / imageRatio : previewW / aspectRatioValue

      displayCanvas.width = Math.max(previewW, 1)
      displayCanvas.height = Math.max(previewH, 1)

      displayCtx.clearRect(0, 0, previewW, previewH)
      displayCtx.drawImage(workCanvas, 0, 0, previewW, previewH)

      displayCanvas.toBlob(
        (blob) => {
          if (blob) {
            imagesBlob.current[currentImageIdx] = blob
            const dataUrl = URL.createObjectURL(blob)

            setImagesPreview((prev) => prev.map((item, i) => (i === currentImageIdx ? dataUrl : item)))
          }
        },
        'image/jpeg',
        0.95
      )
    }
  }, [images, currentImageIdx, imagesEditData])

  const addImage = (files: File[]) => {
    const blobs = files.map((file) => new Blob([file]))

    const newImagesData = files.map((file, idx) => {
      const objectUrl = URL.createObjectURL(file)
      originalImages.current[idx + images.length] = objectUrl
      return {
        src: objectUrl,
        id: (idx + images.length).toString(),
        originalSrc: objectUrl,
      }
    })

    blobs.forEach((item, idx) => (imagesBlob.current[idx + images.length] = item))

    setImagesPreview((prev) => [...prev, ...files.map((file) => URL.createObjectURL(file))])
    setImages((prev) => [...prev, ...newImagesData])
    setImagesEditData((prev) => [
      ...prev,
      ...files.map(() => {
        const result: ImageEditData = { scale: 1, aspectRatio: ASPECT_RATIOS[0], imageFilter: 'Normal' }
        return result
      }),
    ])
  }

  const getImage = (idx: number) => images?.[idx]

  const removeImage = (idx: number) => {
    delete imagesBlob.current[idx]
    delete originalImages.current[idx]

    const updatedBlobs: Record<number, Blob> = {}
    const updatedOriginals: Record<number, string> = {}

    Object.entries(imagesBlob.current).forEach(([key, blob], i) => {
      updatedBlobs[i] = blob
    })

    Object.entries(originalImages.current).forEach(([key, src], i) => {
      updatedOriginals[i] = src
    })

    imagesBlob.current = updatedBlobs
    originalImages.current = updatedOriginals

    setImagesPreview((prev) => prev.filter((_, i) => i !== idx))
    setImages((prev) => prev.filter((_, i) => i !== idx))
    setImagesEditData((prev) => prev.filter((_, i) => i !== idx))
    setCurrentImageIdx((prev) => Math.max(0, Math.min(prev, imagePreviews.length - 2)))
  }

  const clearAll = () => {
    setImages([])
    setImagesEditData([])
    setImagesPreview([])
    setDescription('')
    setCurrentImageIdx(0)
    imagesBlob.current = {}
    originalImages.current = {}
  }

  const handleChangeImageData = (imageEditData: Partial<ImageEditData>) => {
    setImagesEditData((prev) => prev.map((item, i) => (i === currentImageIdx ? { ...item, ...imageEditData } : item)))
  }

  const resetToOriginal = (idx?: number) => {
    const imageIdx = idx !== undefined ? idx : currentImageIdx

    if (!images[imageIdx] || !originalImages.current[imageIdx]) return

    setImages((prev) =>
      prev.map((img, i) => (i === imageIdx ? { ...img, src: originalImages.current[imageIdx] } : img))
    )

    setImagesEditData((prev) =>
      prev.map((data, i) => (i === imageIdx ? { scale: 1, aspectRatio: 'original', imageFilter: 'Normal' } : data))
    )
  }

  const publishPost = async () => {
    try {
      const formData = new FormData()
      Object.values(imagesBlob.current).forEach((blob, idx) => formData.append('file', blob))
      const uploadImagesData = await uploadImage(formData).unwrap()
      const imageIds = uploadImagesData.images.map(({ uploadId }) => ({ uploadId }))
      await createPost({ description, childrenMetadata: imageIds }).unwrap()
    } catch (err) {}
  }

  return (
    <PostContext.Provider
      value={{
        description,
        images: images || [],
        imagesEditData,
        imagesBlob: imagesBlob.current,
        imagePreviews,
        setDescription,
        addImage,
        getImage,
        removeImage,
        clearAll,
        setCurrentImageIndex: setCurrentImageIdx,
        setImageEditData: handleChangeImageData,
        publishPost,
        currentImageIdx,
        resetToOriginal,
      }}
    >
      {children}
    </PostContext.Provider>
  )
}
