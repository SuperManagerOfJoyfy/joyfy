import { useMemo } from 'react'

const stringToColor = (str: string): string => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  let color = '#'
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff
    color += ('00' + value.toString(16)).slice(-2)
  }

  return color
}

const adjustColor = (color: string, percent: number): string => {
  const num = parseInt(color.slice(1), 16)
  const amt = Math.round(255 * percent)

  const R = Math.min(255, Math.max(0, (num >> 16) + amt))
  const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amt))
  const B = Math.min(255, Math.max(0, (num & 0x0000ff) + amt))

  return '#' + ((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)
}

export const useGenerateColor = (name: string = 'default') => {
  const { lightBackground, textColor } = useMemo(() => {
    const baseColor = stringToColor(name.toLowerCase().trim())

    return {
      lightBackground: adjustColor(baseColor, 0.3),
      textColor: adjustColor(baseColor, -0.2),
    }
  }, [name])

  return { lightBackground, textColor }
}
