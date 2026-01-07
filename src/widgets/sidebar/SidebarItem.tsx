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

import { SidebarItem } from './Sidebar'
import { PATH } from '@/shared/config/routes'

type SidebarActionHandlers = {
  onOpenLogoutModalHandler?: () => void
  onCreatePost?: () => void
}

export const createSidebarItems = (
  role: 'user' | 'admin',
  userId?: number,
  handlers: SidebarActionHandlers = {},
  t?: (key: string) => string,
  unreadMessagesCount?: number
): SidebarItem[] => {
  const translate = t || ((key: string) => key)

  const adminItems: SidebarItem[] = [
    {
      id: 'users',
      title: translate('usersList'),
      path: PATH.ADMIN.USERS,
      icon: <FiUsers />,
      activeIcon: <FaUsers />,
    },
    {
      id: 'stats',
      title: translate('statistics'),
      path: PATH.ADMIN.STATISTICS,
      icon: <FiTrendingUp />,
      activeIcon: <FaChartLine />,
    },
    {
      id: 'payments',
      title: translate('paymentsList'),
      path: PATH.ADMIN.PAYMENTS,
      icon: <FiCreditCard />,
      activeIcon: <FaCreditCard />,
    },
    {
      id: 'posts',
      title: translate('postsList'),
      path: PATH.ADMIN.POSTS,
      icon: <FiImage />,
      activeIcon: <FaImage />,
    },
  ]

  const userItems: SidebarItem[] = [
    {
      id: 'home',
      title: translate('home'),
      path: PATH.ROOT,
      icon: <FiHome />,
      activeIcon: <FaHome />,
    },
    {
      id: 'create',
      title: translate('create'),
      path: handlers.onCreatePost ? undefined : PATH.USER.CREATE,
      icon: <FiPlusCircle />,
      onClick: handlers.onCreatePost,
      activeIcon: <FaPlusCircle />,
      className: 'customItem',
      isActive: (currentPath) => !!currentPath?.includes('action=create'),
    },
    {
      id: 'profile',
      title: translate('myProfile'),
      path: userId ? `${PATH.USER.PROFILE}/${userId}` : PATH.USER.PROFILE,
      icon: <FiUser />,
      activeIcon: <FaUser />,
    },
    {
      id: 'messenger',
      title: translate('messenger'),
      path: PATH.USER.MESSENGER,
      icon: <FiMessageCircle />,
      activeIcon: <FaComments />,
      badge: unreadMessagesCount && unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
    },
    {
      id: 'search',
      title: translate('search'),
      path: PATH.USER.SEARCH,
      icon: <FiSearch />,
      activeIcon: <FaSearch />,
    },
    {
      id: 'statistics',
      title: translate('statistics'),
      path: PATH.USER.STATISTICS,
      icon: <FiBarChart2 />,
      activeIcon: <FaChartBar />,
      style: { marginTop: '60px' },
    },
    {
      id: 'favorites',
      title: translate('favorites'),
      path: PATH.USER.FAVORITES,
      icon: <FiStar />,
      activeIcon: <FaStar />,
      style: { marginBottom: '180px' },
    },
    {
      id: 'logout',
      title: translate('logout'),
      icon: <FiLogOut />,
      activeIcon: <FaSignOutAlt />,
      onClick: handlers.onOpenLogoutModalHandler,
      className: 'customItem',
    },
  ]

  return role === 'admin' ? adminItems : userItems
}
