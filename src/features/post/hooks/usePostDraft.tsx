import { DraftData, ImageSettings } from '../types/types'

export const usePostDraft = () => {
  const DRAFT_KEY = 'post_draft'

  const saveDraft = (data: DraftData) => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data))
  }

  const loadDraft = (): DraftData | null => {
    const draftStr = localStorage.getItem(DRAFT_KEY)
    if (!draftStr) return null

    try {
      return JSON.parse(draftStr)
    } catch (e) {
      console.error('Failed to parse draft data', e)
      localStorage.removeItem(DRAFT_KEY)
      return null
    }
  }

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY)
  }

  const hasDraft = () => {
    return !!localStorage.getItem(DRAFT_KEY)
  }

  const saveCompleteDraft = (step: DraftData['step'], currentImageIndex: number, description?: string) => {
    const draft: DraftData = {
      step,
      timestamp: Date.now(),
      currentImageIndex,
      description,
    }
    saveDraft(draft)
  }

  return {
    saveDraft,
    loadDraft,
    clearDraft,
    hasDraft,
    saveCompleteDraft,
  }
}
