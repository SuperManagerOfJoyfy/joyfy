import { ReactNode, CSSProperties } from 'react'
import Link from 'next/link'
import { clsx } from 'clsx'

import s from './Sidebar.module.scss'

export interface SidebarItem {
  id: string
  title: string
  path: string
  icon: ReactNode
  disabled?: boolean
  className?: string
  style?: CSSProperties
}

export interface SidebarProps {
  items: SidebarItem[]
  activeItemId?: string
  onItemClick?: (item: SidebarItem) => void
  disabled?: boolean
  className?: string
}

export const Sidebar = ({
  items,
  activeItemId,
  onItemClick,
  disabled = false,
  className = '',
}: SidebarProps) => {
  const handleItemClick = (item: SidebarItem) => {
    if (!disabled && !item.disabled && onItemClick) {
      onItemClick(item)
    }
  }

  const renderItem = (item: SidebarItem) => {
    const isActive = item.id === activeItemId
    const isItemDisabled = disabled || item.disabled

    const linkClassNames = clsx(
      s.sidebarLink,
      isActive && s.active,
      isItemDisabled && s['sidebarLink--disabled'],
      item.className
    )

    return (
      <li
        key={item.id}
        className={s.sidebarItem}
        style={item.style} 
        data-id={item.id}
      >
        <Link
          href={isItemDisabled ? '#' : item.path}
          className={linkClassNames}
          onClick={(e) => {
            if (isItemDisabled) {
              e.preventDefault()
              return
            }
            handleItemClick(item)
          }}
          tabIndex={isItemDisabled ? -1 : 0}
          aria-current={isActive ? 'page' : undefined}
          aria-disabled={isItemDisabled}
          aria-label={item.title}
        >
          <span className={s.icon} aria-hidden="true">
            {item.icon}
          </span>
          <span className={s.title}>{item.title}</span>
        </Link>
      </li>
    )
  }

  const sidebarClassNames = clsx(s.sidebar, disabled && s.disabled, className)

  return (
    <aside
      className={sidebarClassNames}
      role="navigation"
      aria-label="Sidebar Navigation"
    >
      <nav className={s.sidebarNav}>
        <ul className={s.sidebarList}>
          {items.map((item) => renderItem(item))}
        </ul>
      </nav>
    </aside>
  )
}
