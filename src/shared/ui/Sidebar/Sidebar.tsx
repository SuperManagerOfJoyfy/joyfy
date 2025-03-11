import React from "react";
import Link from "next/link";

import styles from "./Sidebar.module.scss";

export interface SidebarItem {
  id: string;
  title: string;
  path: string;
  icon: React.ReactNode;
}

export interface SidebarProps {
  items: SidebarItem[];
  bottomItems?: SidebarItem[];
  activeItemId?: string;
  onItemClick?: (item: SidebarItem) => void;
  disabled?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  bottomItems = [],
  activeItemId,
  onItemClick,
  disabled = false,
}) => {
  const handleItemClick = (item: SidebarItem) => {
    if (!disabled && onItemClick) {
      onItemClick(item);
    }
  };

  const renderItem = (item: SidebarItem) => {
    const isActive = item.id === activeItemId;

    return (
      <li key={item.id} className={styles.sidebarItem}>
        <Link
          href={item.path}
          className={`${styles.sidebarLink} ${isActive ? styles.active : ""} ${
            disabled ? styles.disabled : ""
          }`}
          onClick={(e) => {
            if (disabled) {
              e.preventDefault();
              return;
            }
            handleItemClick(item);
          }}
          tabIndex={disabled ? -1 : 0}
        >
          <span className={styles.icon}>{item.icon}</span>
          <span className={styles.title}>{item.title}</span>
        </Link>
      </li>
    );
  };

  return (
    <aside className={`${styles.sidebar} ${disabled ? styles.disabled : ""}`}>
      <nav className={styles.sidebarNav}>
        <ul className={styles.sidebarList}>{items.map(renderItem)}</ul>
        {bottomItems.length > 0 && (
          <ul className={styles.sidebarBottomList}>
            {bottomItems.map(renderItem)}
          </ul>
        )}
      </nav>
    </aside>
  );
};
