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
    path: '/',
    icon: <FiHome />,
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
    path: '/messenger',
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
    path: '/statistics',
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
    path: '/logout',
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

export const Active: Story = {
  args: {
    ...defaultArgs,
    activeItemId: 'home',
  },
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
        path: '/messenger',
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
        path: '/statistics',
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
        path: '/logout',
        icon: <FiLogOut />,
      },
    ],
  },
}
