'use client'

import { ReactNode, CSSProperties, memo, useCallback } from 'react'
import { Link } from '@/i18n/navigation'
import { clsx } from 'clsx'

import s from './Sidebar.module.scss'

export type SidebarItem = {
  id: string
  title: string
  path?: string
  icon: ReactNode
  activeIcon?: ReactNode
  disabled?: boolean
  className?: string
  style?: CSSProperties
  onClick?: () => void
  isActive?: (currentPath?: string) => boolean
  badge?: number
}

type Props = {
  items: SidebarItem[]
  activePath?: string
  onItemClick?: (item: SidebarItem) => void
  disabled?: boolean
  className?: string
}

const determineActiveState = (itemPath: string | undefined, currentPath: string | undefined): boolean => {
  if (!itemPath || !currentPath) return false

  if (itemPath === '/') {
    return currentPath === '/' || currentPath === ''
  }

  if (itemPath === currentPath) return true

  const normalizedItemPath = itemPath.endsWith('/') ? itemPath.slice(0, -1) : itemPath
  const normalizedCurrentPath = currentPath.endsWith('/') ? currentPath.slice(0, -1) : currentPath

  if (normalizedItemPath === normalizedCurrentPath) return true

  if (normalizedItemPath !== '/' && normalizedCurrentPath.startsWith(normalizedItemPath + '/')) {
    const remainingPath = normalizedCurrentPath.slice(normalizedItemPath.length + 1)
    return !remainingPath.includes('/')
  }

  return false
}

const SidebarItemComponent = memo(
  ({
    item,
    activePath,
    disabled,
    onItemClick,
  }: {
    item: SidebarItem
    activePath?: string
    disabled: boolean
    onItemClick: (item: SidebarItem) => void
  }) => {
    const isActive = item.isActive ? item.isActive(activePath) : determineActiveState(item.path, activePath)
    const isItemDisabled = disabled || item.disabled

    const linkClassNames = clsx(
      s.sidebarLink,
      isItemDisabled && s['sidebarLink--disabled'],
      isActive && !isItemDisabled && s.active,
      item.className && s[item.className]
    )

    const iconToRender = isActive && item.activeIcon ? item.activeIcon : item.icon

    const linkContent = (
      <>
        <span className={s.icon} aria-hidden="true">
          {iconToRender}
        </span>
        <span className={s.title}>{item.title}</span>
        {item.badge && (
          <span className={s.badge} aria-label={`${item.badge} unread messages`}>
            {item.badge}
          </span>
        )}
      </>
    )

    const handleItemClick = useCallback((e: React.MouseEvent) => {
      if (isItemDisabled) {
        e?.preventDefault()
        return
      }
      item.onClick?.()
      onItemClick(item)
    }, [])

    if (!item.path) {
      return (
        <li key={item.id} className={s.sidebarItem} style={item.style}>
          <button
            type="button"
            className={linkClassNames}
            onClick={handleItemClick}
            disabled={isItemDisabled}
            aria-disabled={isItemDisabled}
            aria-label={item.title}
          >
            {linkContent}
          </button>
        </li>
      )
    }

    return (
      <li key={item.id} className={s.sidebarItem} style={item.style}>
        <Link
          href={isItemDisabled ? '#' : item.path}
          className={linkClassNames}
          onClick={handleItemClick}
          tabIndex={isItemDisabled ? -1 : 0}
          aria-current={isActive ? 'page' : undefined}
          aria-disabled={isItemDisabled}
          aria-label={item.title}
        >
          {linkContent}
        </Link>
      </li>
    )
  }
)
SidebarItemComponent.displayName = 'SidebarItemComponent'

export const Sidebar = memo(({ items, activePath, onItemClick, disabled = false, className = '' }: Props) => {
  const handleItemClick = useCallback(
    (item: SidebarItem) => {
      if (disabled || item.disabled) return
      onItemClick?.(item)
    },
    [disabled, onItemClick]
  )

  const sidebarClassNames = clsx(s.sidebar, disabled && s.disabled, className)

  return (
    <aside className={sidebarClassNames} role="navigation" aria-label="Sidebar Navigation">
      <nav className={s.sidebarNav}>
        <ul className={s.sidebarList}>
          {items.map((item) => (
            <SidebarItemComponent
              key={item.id}
              item={item}
              activePath={activePath}
              disabled={disabled}
              onItemClick={handleItemClick}
            />
          ))}
        </ul>
      </nav>
    </aside>
  )
})

Sidebar.displayName = 'Sidebar'
