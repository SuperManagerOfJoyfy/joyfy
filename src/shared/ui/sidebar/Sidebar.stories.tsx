import { Meta, StoryObj } from '@storybook/react'
import { FiHome, FiPlusCircle, FiUser, FiMessageCircle, FiSearch, FiBarChart2, FiStar, FiLogOut } from 'react-icons/fi'

import { Sidebar } from './Sidebar'

import { createSidebarItems } from '@/shared/ui/sidebar/SidebarItem'

const meta: Meta<typeof Sidebar> = {
  title: 'Components/Sidebar',
  tags: ['autodocs'],
  component: Sidebar,
  parameters: {
    layout: 'centered',
    nextjs: {
      appDirectory: true,
    },
  },
}

export default meta

type Story = StoryObj<typeof Sidebar>

const userSidebarItems = createSidebarItems('user')

const adminSidebarItems = createSidebarItems('admin')

export const Default: Story = {
  args: {
    items: userSidebarItems,
    activePath: '/',
  },
}

export const Disabled: Story = {
  args: {
    items: userSidebarItems,
    disabled: true,
    activePath: '/',
  },
}

export const DisabledItem: Story = {
  args: {
    items: [
      {
        id: 'home',
        title: 'Home',
        path: '/',
        icon: <FiHome />,
        disabled: true,
      },
      {
        id: 'create',
        title: 'Create',
        path: '/create',
        icon: <FiPlusCircle />,
      },
      {
        id: 'profile',
        title: 'My Profile',
        path: '/profile',
        icon: <FiUser />,
      },
      {
        id: 'messenger',
        title: 'Messenger',
        path: '/messages',
        icon: <FiMessageCircle />,
      },
      {
        id: 'search',
        title: 'Search',
        path: '/search',
        icon: <FiSearch />,
        style: { marginBottom: '60px' },
      },
      {
        id: 'statistics',
        title: 'Statistics',
        path: '/stats',
        icon: <FiBarChart2 />,
      },
      {
        id: 'favorites',
        title: 'Favorites',
        path: '/favorites',
        icon: <FiStar />,
        style: { marginBottom: '180px' },
      },
      {
        id: 'logout',
        title: 'Log Out',
        icon: <FiLogOut />,
        className: 'customItem',
        onClick: () => console.log('Logging out...'),
      },
    ],
  },
}

export const AdminSidebar: Story = {
  args: {
    items: adminSidebarItems,
    activePath: '/admin/stats',
  },
}
