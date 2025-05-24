import { useMemo } from 'react'

export const useGenerateColor = () => {
  const adjustColor = (color: string, percent: number) => {
    const num = parseInt(color.slice(1), 16)
    const amt = Math.round(255 * percent)

    const R = Math.min(255, Math.max(0, (num >> 16) + amt))
    const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amt))
    const B = Math.min(255, Math.max(0, (num & 0x0000ff) + amt))

    return '#' + ((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)
  }

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF'
    let color = '#'

    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }

    return color
  }

  const { lightBackground, textColor } = useMemo(() => {
    const base = getRandomColor()

    return {
      lightBackground: adjustColor(base, 0.3),
      textColor: adjustColor(base, -0.2),
    }
  }, [])

  return { lightBackground, textColor }
}
