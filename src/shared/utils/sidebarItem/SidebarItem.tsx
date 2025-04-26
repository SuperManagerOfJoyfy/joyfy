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

import {
  FaHome,
  FaChartBar,
  FaCreditCard,
  FaImage,
  FaSignOutAlt,
  FaComments,
  FaPlusCircle,
  FaSearch,
  FaStar,
  FaChartLine,
  FaUser,
  FaUsers,
} from 'react-icons/fa'

import { SidebarItem } from '../../ui/sidebar'
import { PATH } from '@/shared/config/routes'

type SidebarActionHandlers = {
  onOpenLogoutModalHandler?: () => void
  onCreatePost?: () => void
}

export const createSidebarItems = (role: 'user' | 'admin', handlers: SidebarActionHandlers = {}): SidebarItem[] => {
  const adminItems: SidebarItem[] = [
    {
      id: 'users',
      title: 'Users list',
      path: PATH.ADMIN.USERS,
      icon: <FiUsers />,
      activeIcon: <FaUsers />,
    },
    {
      id: 'stats',
      title: 'Statistics',
      path: PATH.ADMIN.STATISTICS,
      icon: <FiTrendingUp />,
      activeIcon: <FaChartLine />,
    },
    {
      id: 'payments',
      title: 'Payments list',
      path: PATH.ADMIN.PAYMENTS,
      icon: <FiCreditCard />,
      activeIcon: <FaCreditCard />,
    },
    {
      id: 'posts',
      title: 'Posts list',
      path: PATH.ADMIN.POSTS,
      icon: <FiImage />,
      activeIcon: <FaImage />,
    },
  ]

  const userItems: SidebarItem[] = [
    {
      id: 'home',
      title: 'Home',
      path: PATH.ROOT,
      icon: <FiHome />,
      activeIcon: <FaHome />,
    },
    {
      id: 'create',
      title: 'Create',
      path: PATH.USER.CREATE,
      icon: <FiPlusCircle />,
      onClick: handlers.onCreatePost,
      activeIcon: <FaPlusCircle />,
    },
    {
      id: 'profile',
      title: 'My Profile',
      path: PATH.USER.PROFILE,
      icon: <FiUser />,
      activeIcon: <FaUser />,
    },
    {
      id: 'messenger',
      title: 'Messenger',
      path: PATH.USER.MESSENGER,
      icon: <FiMessageCircle />,
      activeIcon: <FaComments />,
    },
    {
      id: 'search',
      title: 'Search',
      path: PATH.USER.SEARCH,
      icon: <FiSearch />,
      activeIcon: <FaSearch />,
    },
    {
      id: 'statistics',
      title: 'Statistics',
      path: PATH.USER.STATISTICS,
      icon: <FiBarChart2 />,
      activeIcon: <FaChartBar />,
      style: { marginTop: '60px' },
    },
    {
      id: 'favorites',
      title: 'Favorites',
      path: PATH.USER.FAVORITES,
      icon: <FiStar />,
      activeIcon: <FaStar />,
      style: { marginBottom: '180px' },
    },
    {
      id: 'logout',
      title: 'Log Out',
      icon: <FiLogOut />,
      activeIcon: <FaSignOutAlt />,
      onClick: handlers.onOpenLogoutModalHandler,
      className: 'logoutItem',
    },
  ]

  return role === 'admin' ? adminItems : userItems
}
