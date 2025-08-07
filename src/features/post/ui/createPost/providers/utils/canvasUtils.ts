import { POST_CONSTANTS } from './postConstants'

import { type CanvasDimensions, type CropParams, type DrawParams } from './postTypes'

export const calculateAspectRatio = (aspect: string, imageWidth: number, imageHeight: number): number => {
  if (aspect === 'original') {
    return imageWidth / imageHeight
  }
  const [w, h] = aspect.split(':').map(Number)
  return w / h
}

export const calculateCropParams = (
  imageWidth: number,
  imageHeight: number,
  aspectRatio: number,
  isOriginalAspect: boolean
): CropParams => {
  if (isOriginalAspect) {
    return { x: 0, y: 0, width: imageWidth, height: imageHeight }
  }

  const imageRatio = imageWidth / imageHeight
  let cropX = 0,
    cropY = 0,
    cropW = imageWidth,
    cropH = imageHeight

  if (imageRatio > aspectRatio) {
    cropW = imageHeight * aspectRatio
    cropX = (imageWidth - cropW) / 2
  } else {
    cropH = imageWidth / aspectRatio
    cropY = (imageHeight - cropH) / 2
  }

  return { x: cropX, y: cropY, width: cropW, height: cropH }
}

export const calculateCanvasDimensions = (aspectRatio: number, isOriginalAspect: boolean): CanvasDimensions => {
  const baseW = POST_CONSTANTS.CANVAS.BASE_WIDTH
  const baseH = isOriginalAspect ? baseW / aspectRatio : baseW / aspectRatio

  return {
    width: Math.max(baseW, POST_CONSTANTS.CANVAS.MIN_DIMENSION),
    height: Math.max(baseH, POST_CONSTANTS.CANVAS.MIN_DIMENSION),
  }
}

export const drawImageToCanvas = ({ image, crop, canvas, scale, filter }: DrawParams): void => {
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas context not available')

  const { width: canvasWidth, height: canvasHeight } = canvas

  ctx.clearRect(0, 0, canvasWidth, canvasHeight)
  ctx.filter = filter

  const scaledW = canvasWidth * scale
  const scaledH = canvasHeight * scale
  const offsetX = (canvasWidth - scaledW) / 2
  const offsetY = (canvasHeight - scaledH) / 2

  if (!image.complete || image.naturalWidth === 0) {
    throw new Error('Image not ready for drawing')
  }

  ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, offsetX, offsetY, scaledW, scaledH)
}

export const canvasToBlob = (canvas: HTMLCanvasElement): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Failed to create blob from canvas'))
        }
      },
      POST_CONSTANTS.IMAGE.FORMAT,
      POST_CONSTANTS.IMAGE.QUALITY
    )
  })
}
