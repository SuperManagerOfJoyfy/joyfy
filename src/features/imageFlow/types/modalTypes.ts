import { ComponentType } from 'react'

export type ModalStep = string

export type ModalConfig = {
  title: string
  size: 'sm' | 'md' | 'lg'
  cardPadding: 'default' | 'top-only' | 'none'
  centerTitle: boolean
}

export type StepProps = Record<string, any>

export type ModalFlow<T extends string = string> = {
  steps: T[]
  components: Record<T, ComponentType<any>>
  config: Record<T, ModalConfig>
}
