import React from 'react'
import { Meta, StoryObj } from '@storybook/react'

import {
  FiHome,
  FiPlusCircle,
  FiUser,
  FiMessageCircle,
  FiSearch,
  FiBarChart2,
  FiStar,
  FiLogOut,
} from 'react-icons/fi'

import { Sidebar } from './Sidebar'

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

const items = [
  {
    id: 'home',
    title: 'Home',
    path: '#',
    icon: <FiHome />,
  },
  {
    id: 'create',
    title: 'Create',
    path: '#',
    icon: <FiPlusCircle />,
  },
  {
    id: 'profile',
    title: 'My Profile',
    path: '#',
    icon: <FiUser />,
  },
  {
    id: 'messenger',
    title: 'Messenger',
    path: '#',
    icon: <FiMessageCircle />,
  },
  {
    id: 'search',
    title: 'Search',
    path: '#',
    icon: <FiSearch />,
  },
  {
    id: 'statistics',
    title: 'Statistics',
    path: '#',
    icon: <FiBarChart2 />,
    style: { marginTop: '60px' },
  },
  {
    id: 'favorites',
    title: 'Favorites',
    path: '#',
    icon: <FiStar />,
    style: { marginBottom: '180px' },
  },
  {
    id: 'logout',
    title: 'Log Out',
    path: '#',
    icon: <FiLogOut />,
  },
]

const defaultArgs = {
  items: items,
  defaultItemSpacing: 8,
}

export const Default: Story = {
  args: defaultArgs,
}

export const Disabled: Story = {
  args: {
    ...defaultArgs,
    disabled: true,
  },
}

export const DisabledItem: Story = {
  args: {
    ...defaultArgs,
    items: [
      {
        id: 'home',
        title: 'Home',
        path: '#',
        icon: <FiHome />,
        disabled: true,
      },
      {
        id: 'create',
        title: 'Create',
        path: '#',
        icon: <FiPlusCircle />,
      },
      {
        id: 'profile',
        title: 'My Profile',
        path: '#',
        icon: <FiUser />,
      },
      {
        id: 'messenger',
        title: 'Messenger',
        path: '#',
        icon: <FiMessageCircle />,
      },
      {
        id: 'search',
        title: 'Search',
        path: '#',
        icon: <FiSearch />,
        style: { marginBottom: '60px' },
      },
      {
        id: 'statistics',
        title: 'Statistics',
        path: '#',
        icon: <FiBarChart2 />,
      },
      {
        id: 'favorites',
        title: 'Favorites',
        path: '#',
        icon: <FiStar />,
        style: { marginBottom: '180px' },
      },
      {
        id: 'logout',
        title: 'Log Out',
        path: '#',
        icon: <FiLogOut />,
      },
    ],
  },
}
