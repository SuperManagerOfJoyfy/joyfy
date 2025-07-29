import { POST_CONSTANTS, DraftData } from '../providers/utils'

export class DraftStorageService {
  private static instance: DraftStorageService

  static getInstance(): DraftStorageService {
    if (!DraftStorageService.instance) {
      DraftStorageService.instance = new DraftStorageService()
    }
    return DraftStorageService.instance
  }

  private async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(POST_CONSTANTS.DRAFT.DB_NAME, POST_CONSTANTS.DRAFT.VERSION)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(POST_CONSTANTS.DRAFT.STORE_NAME)) {
          const store = db.createObjectStore(POST_CONSTANTS.DRAFT.STORE_NAME, { keyPath: 'id' })
          store.createIndex('userId', 'userId', { unique: true })
        }
      }
    })
  }

  async saveDraft(draft: DraftData): Promise<void> {
    const db = await this.openDB()
    const transaction = db.transaction([POST_CONSTANTS.DRAFT.STORE_NAME], 'readwrite')
    const store = transaction.objectStore(POST_CONSTANTS.DRAFT.STORE_NAME)
    const index = store.index('userId')

    return new Promise<void>((resolve, reject) => {
      const getRequest = index.get(draft.userId)

      getRequest.onsuccess = () => {
        const existingDraft = getRequest.result

        const handlePut = () => {
          const putRequest = store.put(draft)
          putRequest.onerror = () => reject(putRequest.error)
          putRequest.onsuccess = () => resolve()
        }

        if (existingDraft) {
          const deleteRequest = store.delete(existingDraft.id)
          deleteRequest.onsuccess = handlePut
          deleteRequest.onerror = () => reject(deleteRequest.error)
        } else {
          handlePut()
        }
      }

      getRequest.onerror = () => reject(getRequest.error)
    })
  }

  async getDraft(userId: number): Promise<DraftData | null> {
    const db = await this.openDB()
    const transaction = db.transaction([POST_CONSTANTS.DRAFT.STORE_NAME], 'readonly')
    const store = transaction.objectStore(POST_CONSTANTS.DRAFT.STORE_NAME)
    const index = store.index('userId')

    return new Promise<DraftData | null>((resolve, reject) => {
      const request = index.get(userId)
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result || null)
    })
  }

  async deleteDraft(userId: number): Promise<void> {
    const db = await this.openDB()
    const transaction = db.transaction([POST_CONSTANTS.DRAFT.STORE_NAME], 'readwrite')
    const store = transaction.objectStore(POST_CONSTANTS.DRAFT.STORE_NAME)
    const index = store.index('userId')

    return new Promise<void>((resolve, reject) => {
      const getRequest = index.get(userId)
      getRequest.onsuccess = () => {
        const draft = getRequest.result
        if (draft) {
          const deleteRequest = store.delete(draft.id)
          deleteRequest.onerror = () => reject(deleteRequest.error)
          deleteRequest.onsuccess = () => resolve()
        } else {
          resolve()
        }
      }
      getRequest.onerror = () => reject(getRequest.error)
    })
  }

  async hasDraft(userId: number): Promise<boolean> {
    try {
      const draft = await this.getDraft(userId)
      return draft !== null
    } catch {
      return false
    }
  }

  generateDraftId(userId: number): string {
    return `${POST_CONSTANTS.DRAFT.ID_PREFIX}${userId}`
  }
}
