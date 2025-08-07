export const POST_CONSTANTS = {
  CANVAS: {
    BASE_WIDTH: 1000,
    MIN_DIMENSION: 1,
    PREVIEW_WIDTH: 500,
  },
  IMAGE: {
    QUALITY: 0.95,
    FORMAT: 'image/jpeg' as const,
  },
  DRAFT: {
    ID_PREFIX: 'draft_',
    DB_NAME: 'PostDraftsDB',
    VERSION: 1,
    STORE_NAME: 'drafts',
  },
} as const
