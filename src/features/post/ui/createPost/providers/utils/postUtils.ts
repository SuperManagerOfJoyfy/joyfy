export const createObjectUrlSafe = (blob: Blob): string => {
  try {
    return URL.createObjectURL(blob)
  } catch (error) {
    throw new Error('Failed to create object URL')
  }
}

export const revokeObjectUrlSafe = (url: string): void => {
  if (url.startsWith('blob:')) {
    try {
      URL.revokeObjectURL(url)
    } catch (error) {}
  }
}

export const cleanupObjectUrls = (urls: string[]): void => {
  urls.forEach(revokeObjectUrlSafe)
}
