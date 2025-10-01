import { ASPECT_RATIOS } from '@/features/post/types/postTypes'
import { ImageEditData, ImageItem } from './postTypes'
import { createObjectUrlSafe } from './postUtils'

export const createNewImages = (files: File[], startIndex: number) => {
  const newImages: ImageItem[] = []
  const blobsRecord: Record<number, Blob> = {}
  const originalsRecord: Record<number, string> = {}
  const newPreviews: string[] = []
  const newEditData: ImageEditData[] = []

  files.forEach((file, idx) => {
    const objectUrl = createObjectUrlSafe(file)
    const index = startIndex + idx

    blobsRecord[index] = new Blob([file])
    originalsRecord[index] = objectUrl

    newImages.push({
      src: objectUrl,
      id: index.toString(),
      originalSrc: objectUrl,
    })

    newPreviews.push(createObjectUrlSafe(file))
    newEditData.push({
      scale: 1,
      aspectRatio: ASPECT_RATIOS[0],
      imageFilter: 'normal' as const,
    })
  })

  return { newImages, blobsRecord, originalsRecord, newPreviews, newEditData }
}

export const reindexImageData = (
  currentBlobs: Record<number, Blob>,
  currentOriginals: Record<number, string>,
  removeIndex: number
) => {
  delete currentBlobs[removeIndex]
  delete currentOriginals[removeIndex]

  const updatedBlobs: Record<number, Blob> = {}
  const updatedOriginals: Record<number, string> = {}

  Object.entries(currentBlobs).forEach(([key, blob], i) => {
    updatedBlobs[i] = blob
  })

  Object.entries(currentOriginals).forEach(([key, src], i) => {
    updatedOriginals[i] = src
  })

  return { updatedBlobs, updatedOriginals }
}
