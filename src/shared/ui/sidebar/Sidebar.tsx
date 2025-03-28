'use client'

import { ReactNode, CSSProperties } from 'react'
import Link from 'next/link'
import { clsx } from 'clsx'

import s from './Sidebar.module.scss'

export type SidebarItem = {
  id: string
  title: string
  path?: string
  icon: ReactNode
  disabled?: boolean
  className?: string
  style?: CSSProperties
  onClick?: () => void
}

export type SidebarProps = {
  items: SidebarItem[]
  activePath?: string
  onItemClick?: (item: SidebarItem) => void
  disabled?: boolean
  className?: string
}

export const Sidebar = ({
  items,
  activePath,
  onItemClick,
  disabled = false,
  className = '',
}: SidebarProps) => {
  const handleItemClick = (item: SidebarItem) => {
    if (disabled || item.disabled) return
    item.onClick?.()
    onItemClick?.(item)
  }

  const renderItem = (item: SidebarItem) => {
    const isActive = item.path === activePath
    const isItemDisabled = disabled || item.disabled

    const linkClassNames = clsx(
      s.sidebarLink,
      isItemDisabled && s['sidebarLink--disabled'],
      isActive && !isItemDisabled && s.active,
      item.className
    )

    if (!item.path) {
      return (
        <li key={item.id} className={s.sidebarItem} style={item.style}>
          <button
            type="button"
            className={linkClassNames}
            onClick={() => handleItemClick(item)}
            disabled={isItemDisabled}
            aria-disabled={isItemDisabled}
            aria-label={item.title}
          >
            <span className={s.icon} aria-hidden="true">
              {item.icon}
            </span>
            <span className={s.title}>{item.title}</span>
          </button>
        </li>
      )
    }

    return (
      <li key={item.id} className={s.sidebarItem} style={item.style}>
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
        <ul className={s.sidebarList}>{items.map(renderItem)}</ul>
      </nav>
    </aside>
  )
}

// import {
//   ReactNode,
//   isValidElement,
//   cloneElement,
//   Children,
//   CSSProperties,
// } from 'react'
// import { clsx } from 'clsx'

// import s from './Sidebar.module.scss'

// type SidebarChildProps = {
//   id?: string
//   disabled?: boolean
//   active?: boolean
//   onClick?: () => void
// }

// type SidebarProps = {
//   children: ReactNode
//   className?: string
//   disabled?: boolean
//   activeItemId?: string
//   onItemClick?: (id: string) => void
// }

// export const Sidebar = ({
//   children,
//   className = '',
//   disabled = false,
//   activeItemId,
//   onItemClick,
// }: SidebarProps) => {
//   const sidebarClassNames = clsx(s.sidebar, disabled && s.disabled, className)

//   const childrenWithProps = Children.map(children, (child) => {
//     if (!isValidElement<SidebarChildProps>(child)) return child

//     const id = (child.props as SidebarChildProps).id

//     return cloneElement(child, {
//       disabled: disabled || (child.props as SidebarChildProps).disabled,
//       active: (child.props as SidebarChildProps).active ?? activeItemId === id,
//       onClick: () => {
//         if (disabled) return

//         const childOnClick = (child.props as SidebarChildProps).onClick
//         if (childOnClick) {
//           childOnClick()
//         } else if (onItemClick && id) {
//           onItemClick(id)
//         }
//       },
//     } as SidebarChildProps)
//   })

//   return (
//     <aside
//       className={sidebarClassNames}
//       role="navigation"
//       aria-label="Sidebar Navigation"
//       aria-disabled={disabled}
//     >
//       <nav className={s.sidebarNav}>
//         <ul className={s.sidebarList}>{childrenWithProps}</ul>
//       </nav>
//     </aside>
//   )
// }

// export interface SidebarItemProps {
//   id: string
//   title: string
//   path?: string
//   icon: ReactNode
//   disabled?: boolean
//   className?: string
//   style?: CSSProperties
//   onClick?: () => void
//   active?: boolean
// }

// export const SidebarItem = ({
//   id,
//   title,
//   path = '#',
//   icon,
//   disabled = false,
//   className,
//   style,
//   onClick,
//   active = false,
// }: SidebarItemProps) => {
//   const linkClassNames = clsx(
//     s.sidebarLink,
//     active && s.active,
//     disabled && s['sidebarLink--disabled'],
//     className
//   )

//   return (
//     <li className={s.sidebarItem} style={style} data-id={id}>
//       <a
//         href={disabled ? '#' : path}
//         className={linkClassNames}
//         onClick={(e) => {
//           if (disabled) {
//             e.preventDefault()
//             return
//           }
//           onClick?.()
//         }}
//         tabIndex={disabled ? -1 : 0}
//         aria-current={active ? 'page' : undefined}
//         aria-disabled={disabled}
//         aria-label={title}
//       >
//         <span className={s.icon} aria-hidden="true">
//           {icon}
//         </span>
//         <span className={s.title}>{title}</span>
//       </a>
//     </li>
//   )
// }
