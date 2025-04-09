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
import { SidebarItem } from '../../ui/sidebar'
import { PATH } from '@/shared/config/routes'

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
      path: PATH.ADMIN.USERS,
      icon: <FiUsers />,
    },
    {
      id: 'stats',
      title: 'Statistics',
      path: PATH.ADMIN.STATISTICS,
      icon: <FiTrendingUp />,
    },
    {
      id: 'payments',
      title: 'Payments list',
      path: PATH.ADMIN.PAYMENTS,
      icon: <FiCreditCard />,
    },
    {
      id: 'posts',
      title: 'Posts list',
      path: PATH.ADMIN.POSTS,
      icon: <FiImage />,
    },
  ]

  const userItems: SidebarItem[] = [
    {
      id: 'home',
      title: 'Home',
      path: PATH.ROOT,
      icon: <FiHome />,
    },
    {
      id: 'create',
      title: 'Create',
      path: PATH.USER.CREATE,
      icon: <FiPlusCircle />,
    },
    {
      id: 'profile',
      title: 'My Profile',
      path: PATH.USER.PROFILE,
      icon: <FiUser />,
    },
    {
      id: 'messenger',
      title: 'Messenger',
      path: PATH.USER.MESSENGER,
      icon: <FiMessageCircle />,
    },
    {
      id: 'search',
      title: 'Search',
      path: PATH.USER.SEARCH,
      icon: <FiSearch />,
    },
    {
      id: 'statistics',
      title: 'Statistics',
      path: PATH.USER.STATISTICS,
      icon: <FiBarChart2 />,
      style: { marginTop: '60px' },
    },
    {
      id: 'favorites',
      title: 'Favorites',
      path: PATH.USER.FAVORITES,
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
