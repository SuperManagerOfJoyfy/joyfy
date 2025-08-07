import { useState, useRef, useEffect, useCallback } from 'react'

import { DraftStorageService } from '../services/draftStorageService'
import { createObjectUrlSafe, DraftData, ImageEditData, ImageItem } from '../providers/utils'

type DraftLoadResult = {
  images: ImageItem[]
  imagesEditData: ImageEditData[]
  imagePreviews: string[]
  description: string
  blobsRecord: Record<number, Blob>
  originalsRecord: Record<number, string>
}

type UseDraftManagerProps = {
  userId: number
}

export const useDraftManager = ({ userId }: UseDraftManagerProps) => {
  const [hasDraft, setHasDraft] = useState(false)
  const [isDraftLoading, setIsDraftLoading] = useState(false)
  const draftStorageService = useRef(DraftStorageService.getInstance())

  // Check for existing draft on initialization
  useEffect(() => {
    const checkDraft = async () => {
      setIsDraftLoading(true)
      try {
        const hasExistingDraft = await draftStorageService.current.hasDraft(userId)
        setHasDraft(hasExistingDraft)
      } finally {
        setIsDraftLoading(false)
      }
    }

    checkDraft()
  }, [userId])

  const loadDraft = useCallback(async (): Promise<DraftLoadResult | null> => {
    setIsDraftLoading(true)

    try {
      const draft = await draftStorageService.current.getDraft(userId)
      if (!draft) return null

      const blobsRecord: Record<number, Blob> = {}
      const originalsRecord: Record<number, string> = {}

      const sortedBlobs = draft.imagesBlobs.sort((a, b) => a.index - b.index)

      const images = sortedBlobs.map(({ blob }, index) => {
        blobsRecord[index] = blob
        const previewUrl = createObjectUrlSafe(blob)
        originalsRecord[index] = previewUrl

        return {
          id: index.toString(),
          src: previewUrl,
          originalSrc: previewUrl,
        }
      })

      const imagePreviews = images.map((img) => img.src)

      return {
        images,
        imagesEditData: draft.imagesEditData.slice(0, images.length),
        imagePreviews,
        description: draft.description,
        blobsRecord,
        originalsRecord,
      }
    } finally {
      setIsDraftLoading(false)
    }
  }, [userId])

  const saveDraft = useCallback(
    async (draftData: {
      images: ImageItem[]
      imagesEditData: ImageEditData[]
      imagePreviews: string[]
      description: string
      imagesBlob: Record<number, Blob>
    }) => {
      if (draftData.images.length === 0 && !draftData.description.trim()) return

      const imageBlobsArray = Object.entries(draftData.imagesBlob).map(([index, blob]) => ({
        index: parseInt(index),
        blob,
      }))

      const draftDataToSave: DraftData = {
        id: draftStorageService.current.generateDraftId(userId),
        userId,
        description: draftData.description,
        images: draftData.images,
        imagesEditData: draftData.imagesEditData,
        imagePreviews: draftData.imagePreviews,
        imagesBlobs: imageBlobsArray,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }

      await draftStorageService.current.saveDraft(draftDataToSave)
      setHasDraft(true)
    },
    [userId]
  )

  const deleteDraft = useCallback(async () => {
    await draftStorageService.current.deleteDraft(userId)
    setHasDraft(false)
  }, [userId])

  return {
    hasDraft,
    isDraftLoading,
    loadDraft,
    saveDraft,
    deleteDraft,
  }
}
