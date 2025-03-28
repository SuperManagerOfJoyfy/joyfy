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
import { createSidebarItems } from '@/shared/utils/SidebarItem/SidebarItem'


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
    activePath: '/',
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

// import { Meta, StoryObj } from '@storybook/react'

// import { Sidebar, SidebarItem } from './Sidebar'
// import { createSidebarItems } from '@/shared/utils/SidebarItem/SidebarItem'

// const meta: Meta<typeof Sidebar> = {
//   title: 'Components/Sidebar',
//   component: Sidebar,
//   parameters: {
//     layout: 'centered',
//     nextjs: {
//       appDirectory: true,
//     },
//   },
// }
// export default meta

// type Story = StoryObj<typeof Sidebar>

// const renderSidebar = ({
//   role = 'user',
//   activeId,
//   disabled,
//   disableItemIds = [],
//   handlers = {},
// }: {
//   role?: 'user' | 'admin'
//   activeId?: string
//   disabled?: boolean
//   disableItemIds?: string[]
//   handlers?: Parameters<typeof createSidebarItems>[1]
// }) => {
//   const items = createSidebarItems(role, handlers)

//   return (
//     <Sidebar disabled={disabled}>
//       {items.map((item) => (
//         <SidebarItem
//           key={item.id}
//           id={item.id}
//           title={item.title}
//           path={item.path}
//           icon={item.icon}
//           active={item.id === activeId}
//           style={item.style}
//           disabled={disableItemIds.includes(item.id)}
//           onClick={item.onClick}
//         />
//       ))}
//     </Sidebar>
//   )
// }

// export const Default: Story = {
//   render: () =>
//     renderSidebar({
//       role: 'user',
//       activeId: 'home',
//       handlers: {
//         onLogout: () => console.log('Logging out'),
//       },
//     }),
// }

// export const DisabledSidebar: Story = {
//   render: () =>
//     renderSidebar({
//       role: 'user',
//       disabled: true,
//     }),
// }

// export const WithDisabledItem: Story = {
//   render: () =>
//     renderSidebar({
//       role: 'user',
//       disableItemIds: ['home'],
//     }),
// }

// export const AdminSidebar: Story = {
//   render: () =>
//     renderSidebar({
//       role: 'admin',
//       activeId: 'stats',
//     }),
// }
