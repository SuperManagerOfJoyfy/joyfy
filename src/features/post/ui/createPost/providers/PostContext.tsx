import { createContext, ReactNode, useContext, useEffect, useState, useRef, useCallback } from 'react'

import { useCreatePostMutation, useUploadImageMutation } from '@/features/post/api/postsApi'
import { IMAGE_FILTERS } from '@/features/post/types/postTypes'
import {
  POST_CONSTANTS,
  cleanupObjectUrls,
  createObjectUrlSafe,
  calculateAspectRatio,
  calculateCanvasDimensions,
  calculateCropParams,
  canvasToBlob,
  drawImageToCanvas,
  ImageEditData,
  ImageItem,
} from './utils'
import { useDraftManager } from '../hooks/useDraftManager'
import { createNewImages, reindexImageData } from './utils'

type PostContextType = {
  images: ImageItem[]
  imagesEditData: ImageEditData[]
  imagesBlob: Record<number, Blob>
  imagePreviews: string[]
  description: string
  hasDraft: boolean
  isDraftLoading: boolean
  setCurrentImageIndex: (idx: number) => void
  setDescription: (description: string) => void
  setImageEditData: (imageEditData: Partial<ImageEditData>) => void
  addImage: (blob: File[]) => void
  getImage: (idx: number) => ImageItem | undefined
  removeImage: (idx: number) => void
  clearAll: () => void
  publishPost: () => Promise<void>
  saveDraft: () => Promise<void>
  loadDraft: () => Promise<void>
  deleteDraft: () => Promise<void>
  currentImageIdx: number
  resetToOriginal: (idx?: number) => void
}

const PostContext = createContext<PostContextType | null>(null)

export const usePostContext = () => {
  const ctx = useContext(PostContext)
  if (!ctx) throw new Error('PostContext not found')
  return ctx
}

export const PostContextProvider = ({ children, userId }: { children: ReactNode; userId: number }) => {
  // States
  const [currentImageIdx, setCurrentImageIdx] = useState<number>(0)
  const [images, setImages] = useState<ImageItem[]>([])
  const [imagesEditData, setImagesEditData] = useState<ImageEditData[]>([])
  const [imagePreviews, setImagesPreview] = useState<string[]>([])
  const [description, setDescription] = useState('')

  // Refs
  const workCanvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'))
  const displayCanvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'))
  const imagesBlob = useRef<Record<number, Blob>>({})
  const originalImages = useRef<Record<number, string>>({})

  // API
  const [uploadImage] = useUploadImageMutation()
  const [createPost] = useCreatePostMutation()

  // Draft manager
  const {
    hasDraft,
    isDraftLoading,
    loadDraft: loadDraftFromStorage,
    saveDraft: saveDraftToStorage,
    deleteDraft: deleteDraftFromStorage,
  } = useDraftManager({ userId })

  // Process current image with effects
  useEffect(() => {
    if (!images?.length || currentImageIdx >= images.length) return

    const processImage = async () => {
      const img = new Image()
      img.src = images[currentImageIdx].src

      try {
        await new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = reject
        })

        const currentEditData = imagesEditData[currentImageIdx]
        if (!currentEditData) return

        const aspectRatio = calculateAspectRatio(currentEditData.aspectRatio, img.width, img.height)
        const isOriginalAspect = currentEditData.aspectRatio === 'original'
        const crop = calculateCropParams(img.width, img.height, aspectRatio, isOriginalAspect)
        const canvasDims = calculateCanvasDimensions(aspectRatio, isOriginalAspect)

        // Setup work canvas
        const workCanvas = workCanvasRef.current
        workCanvas.width = canvasDims.width
        workCanvas.height = canvasDims.height

        drawImageToCanvas({
          image: img,
          crop,
          canvas: workCanvas,
          scale: currentEditData.scale,
          filter: IMAGE_FILTERS[currentEditData.imageFilter] || 'none',
        })

        // Setup preview canvas
        const displayCanvas = displayCanvasRef.current
        const previewW = POST_CONSTANTS.CANVAS.PREVIEW_WIDTH
        const previewH = isOriginalAspect ? previewW / (img.width / img.height) : previewW / aspectRatio

        displayCanvas.width = Math.max(previewW, POST_CONSTANTS.CANVAS.MIN_DIMENSION)
        displayCanvas.height = Math.max(previewH, POST_CONSTANTS.CANVAS.MIN_DIMENSION)

        const displayCtx = displayCanvas.getContext('2d')
        if (!displayCtx) return

        displayCtx.clearRect(0, 0, previewW, previewH)
        displayCtx.drawImage(workCanvas, 0, 0, previewW, previewH)

        // Create blob and update preview
        const blob = await canvasToBlob(displayCanvas)
        imagesBlob.current[currentImageIdx] = blob
        const dataUrl = createObjectUrlSafe(blob)
        setImagesPreview((prev) => prev.map((item, i) => (i === currentImageIdx ? dataUrl : item)))
      } catch (error) {}
    }

    processImage()
  }, [images, currentImageIdx, imagesEditData])

  const addImage = useCallback(
    (files: File[]) => {
      const { newImages, blobsRecord, originalsRecord, newPreviews, newEditData } = createNewImages(
        files,
        images.length
      )

      Object.assign(imagesBlob.current, blobsRecord)
      Object.assign(originalImages.current, originalsRecord)

      setImages((prev) => [...prev, ...newImages])
      setImagesPreview((prev) => [...prev, ...newPreviews])
      setImagesEditData((prev) => [...prev, ...newEditData])
    },
    [images.length]
  )

  const removeImage = useCallback(
    (idx: number) => {
      const { updatedBlobs, updatedOriginals } = reindexImageData(imagesBlob.current, originalImages.current, idx)

      imagesBlob.current = updatedBlobs
      originalImages.current = updatedOriginals

      const newImages = images.filter((_, i) => i !== idx)
      const newPreviews = imagePreviews.filter((_, i) => i !== idx)
      const newEditData = imagesEditData.filter((_, i) => i !== idx)

      setImages(newImages)
      setImagesPreview(newPreviews)
      setImagesEditData(newEditData)

      const newCurrentIndex = Math.max(0, Math.min(idx, newImages.length - 1))
      setCurrentImageIdx(newCurrentIndex)

      if (newImages.length === 0) {
        setCurrentImageIdx(0)
      }
    },
    [images, imagePreviews, imagesEditData]
  )

  const clearAll = useCallback(() => {
    cleanupObjectUrls(imagePreviews)
    cleanupObjectUrls(Object.values(originalImages.current))

    setImages([])
    setImagesEditData([])
    setImagesPreview([])
    setDescription('')
    setCurrentImageIdx(0)
    imagesBlob.current = {}
    originalImages.current = {}
  }, [imagePreviews])

  const getImage = useCallback((idx: number) => images?.[idx], [images])

  const setImageEditData = useCallback(
    (imageEditData: Partial<ImageEditData>) => {
      setImagesEditData((prev) => prev.map((item, i) => (i === currentImageIdx ? { ...item, ...imageEditData } : item)))
    },
    [currentImageIdx]
  )

  const resetToOriginal = useCallback(
    (idx?: number) => {
      const imageIdx = idx ?? currentImageIdx
      const originalSrc = originalImages.current[imageIdx]

      if (!images[imageIdx] || !originalSrc) return

      setImages((prev) => prev.map((img, i) => (i === imageIdx ? { ...img, src: originalSrc } : img)))

      setImagesEditData((prev) =>
        prev.map((data, i) => (i === imageIdx ? { scale: 1, aspectRatio: 'original', imageFilter: 'Normal' } : data))
      )
    },
    [currentImageIdx, images]
  )

  const loadDraft = useCallback(async () => {
    const draftResult = await loadDraftFromStorage()
    if (!draftResult) return

    clearAll()
    await new Promise((resolve) => setTimeout(resolve, 0))

    imagesBlob.current = draftResult.blobsRecord
    originalImages.current = draftResult.originalsRecord

    setImages(draftResult.images)
    setImagesEditData(draftResult.imagesEditData)
    setImagesPreview(draftResult.imagePreviews)
    setDescription(draftResult.description)
    setCurrentImageIdx(0)
  }, [loadDraftFromStorage, clearAll])

  const saveDraft = useCallback(async () => {
    await saveDraftToStorage({
      images,
      imagesEditData,
      imagePreviews,
      description,
      imagesBlob: imagesBlob.current,
    })
  }, [saveDraftToStorage, images, imagesEditData, imagePreviews, description])

  const deleteDraft = useCallback(async () => {
    await deleteDraftFromStorage()
  }, [deleteDraftFromStorage])

  const publishPost = useCallback(async () => {
    try {
      const formData = new FormData()
      Object.values(imagesBlob.current).forEach((blob) => formData.append('file', blob))

      const uploadImagesData = await uploadImage(formData).unwrap()
      const imageIds = uploadImagesData.images.map(({ uploadId }) => ({ uploadId }))

      await createPost({
        description,
        childrenMetadata: imageIds,
        userId,
      }).unwrap()

      if (hasDraft) await deleteDraft()
      clearAll()
    } catch (err) {
      console.error('Error publishing post:', err)
    }
  }, [uploadImage, createPost, description, userId, hasDraft, deleteDraft, clearAll])

  return (
    <PostContext.Provider
      value={{
        description,
        images: images || [],
        imagesEditData,
        imagesBlob: imagesBlob.current,
        imagePreviews,
        hasDraft,
        isDraftLoading,
        setDescription,
        addImage,
        getImage,
        removeImage,
        clearAll,
        setCurrentImageIndex: setCurrentImageIdx,
        setImageEditData,
        publishPost,
        saveDraft,
        loadDraft,
        deleteDraft,
        currentImageIdx,
        resetToOriginal,
      }}
    >
      {children}
    </PostContext.Provider>
  )
}
