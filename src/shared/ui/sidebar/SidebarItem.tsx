import {
  FiBarChart2,
  FiCreditCard,
  FiHome,
  FiImage,
  FiLogOut,
  FiMessageCircle,
  FiPlusCircle,
  FiSearch,
  FiStar,
  FiTrendingUp,
  FiUser,
  FiUsers,
} from 'react-icons/fi'
import { SidebarItem } from '.'

type SidebarActionHandlers = {
  onLogout?: () => void
  onCreatePost?: () => void
}

export const createSidebarItems = (
  role: 'user' | 'admin',
  handlers: SidebarActionHandlers = {}
): SidebarItem[] => {
  const adminItems: SidebarItem[] = [
    {
      id: 'users',
      title: 'Users list',
      path: '/admin/users',
      icon: <FiUsers />,
    },
    {
      id: 'stats',
      title: 'Statistics',
      path: '/admin/stats',
      icon: <FiTrendingUp />,
    },
    {
      id: 'payments',
      title: 'Payments list',
      path: '/admin/payments',
      icon: <FiCreditCard />,
    },
    {
      id: 'posts',
      title: 'Posts list',
      path: '/admin/posts',
      icon: <FiImage />,
    },
  ]

  const userItems: SidebarItem[] = [
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
    },
    {
      id: 'statistics',
      title: 'Statistics',
      path: '/statistics',
      icon: <FiBarChart2 />,
      style: { marginTop: '60px' },
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
      onClick: handlers.onLogout,
      className: 'logoutItem',
    },
  ]

  return role === 'admin' ? adminItems : userItems
}
