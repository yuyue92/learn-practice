/**
 * 侧边栏组件
 */

import { NavLink } from 'react-router-dom';
import { useAppStore } from '@/stores';

// 导航菜单配置
const menuItems = [
  {
    path: '/app/dashboard',
    label: '工作台',
    icon: '🏠',
  },
  {
    path: '/app/customer/list',
    label: '客户管理',
    icon: '👥',
  },
  {
    path: '/app/sales',
    label: '销售管理',
    icon: '💰',
  },
  {
    path: '/app/product',
    label: '产品库存',
    icon: '📦',
  },
  {
    path: '/app/purchase',
    label: '采购管理',
    icon: '🛒',
  },
  {
    path: '/app/report',
    label: '数据统计',
    icon: '📊',
  },
  {
    path: '/app/system',
    label: '系统配置',
    icon: '⚙️',
  },
  {
    path: '/app/profile',
    label: '个人中心',
    icon: '👤',
  },
];

function Sidebar() {
  const { sidebarCollapsed } = useAppStore();

  return (
    <aside
      className={`${
        sidebarCollapsed ? 'w-16' : 'w-64'
      } bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 transition-all duration-300 no-print`}
    >
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                  : 'hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            {!sidebarCollapsed && (
              <span className="font-medium">{item.label}</span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
