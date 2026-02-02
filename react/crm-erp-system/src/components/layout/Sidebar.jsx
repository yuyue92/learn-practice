/**
 * 侧边栏组件
 * 企业级导航侧边栏，支持折叠、多级菜单
 */
import { useState, useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import {
  HiOutlineHome,
  HiOutlineUsers,
  HiOutlineShoppingCart,
  HiOutlineCube,
  HiOutlineClipboardList,
  HiOutlineTruck,
  HiOutlineChartBar,
  HiOutlineCog,
  HiOutlineChevronDown,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from 'react-icons/hi';
import { useThemeStore, useUserStore } from '@/stores';
import { MENU_CONFIG } from '@/constants/routes';
import { hasPermission } from '@/constants/permissions';

// 图标映射
const iconMap = {
  HiOutlineHome,
  HiOutlineUsers,
  HiOutlineShoppingCart,
  HiOutlineCube,
  HiOutlineClipboardList,
  HiOutlineTruck,
  HiOutlineChartBar,
  HiOutlineCog,
};

/**
 * 菜单项组件
 */
const MenuItem = ({
  item,
  collapsed,
  level = 0,
  expandedKeys,
  onToggleExpand,
}) => {
  const location = useLocation();
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = expandedKeys.includes(item.key);
  
  // 判断是否活跃
  const isActive = useMemo(() => {
    if (hasChildren) {
      return item.children.some(child => location.pathname.startsWith(child.path));
    }
    return location.pathname === item.path || location.pathname.startsWith(item.path + '/');
  }, [location.pathname, item, hasChildren]);

  const Icon = typeof item.icon === 'string' ? iconMap[item.icon] : item.icon;

  const handleClick = () => {
    if (hasChildren) {
      onToggleExpand(item.key);
    }
  };

  const linkClasses = clsx(
    'flex items-center gap-3 px-3 py-2.5 mx-2 rounded-lg',
    'transition-colors duration-150 cursor-pointer',
    'text-neutral-600 dark:text-neutral-400',
    isActive
      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
      : 'hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-700 dark:hover:text-neutral-100',
    level > 0 && 'ml-6'
  );

  const content = (
    <>
      {Icon && (
        <Icon className={clsx(
          'w-5 h-5 flex-shrink-0',
          isActive ? 'text-primary-600 dark:text-primary-400' : ''
        )} />
      )}
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.title}</span>
          {hasChildren && (
            <HiOutlineChevronDown
              className={clsx(
                'w-4 h-4 transition-transform duration-200',
                isExpanded && 'transform rotate-180'
              )}
            />
          )}
        </>
      )}
    </>
  );

  if (hasChildren) {
    return (
      <div>
        <div className={linkClasses} onClick={handleClick}>
          {content}
        </div>
        {!collapsed && isExpanded && (
          <div className="mt-1">
            {item.children.map(child => (
              <MenuItem
                key={child.key}
                item={child}
                collapsed={collapsed}
                level={level + 1}
                expandedKeys={expandedKeys}
                onToggleExpand={onToggleExpand}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink to={item.path} className={linkClasses}>
      {content}
    </NavLink>
  );
};

/**
 * 侧边栏组件
 */
const Sidebar = () => {
  const { sidebarCollapsed, toggleSidebar } = useThemeStore();
  const { user } = useUserStore();
  const location = useLocation();
  
  // 展开的菜单项
  const [expandedKeys, setExpandedKeys] = useState(() => {
    // 默认展开当前路由所在的父菜单
    const keys = [];
    MENU_CONFIG.forEach(item => {
      if (item.children) {
        const isChildActive = item.children.some(
          child => location.pathname.startsWith(child.path)
        );
        if (isChildActive) {
          keys.push(item.key);
        }
      }
    });
    return keys;
  });

  // 过滤有权限的菜单
  const filteredMenu = useMemo(() => {
    if (!user) return [];
    
    const filterItems = (items) => {
      return items.filter(item => {
        // 检查权限
        if (item.permission && !hasPermission(user.role, item.permission)) {
          return false;
        }
        
        // 递归过滤子菜单
        if (item.children) {
          item.children = filterItems(item.children);
          return item.children.length > 0;
        }
        
        return true;
      });
    };
    
    return filterItems([...MENU_CONFIG]);
  }, [user]);

  const handleToggleExpand = (key) => {
    setExpandedKeys(prev => 
      prev.includes(key)
        ? prev.filter(k => k !== key)
        : [...prev, key]
    );
  };

  return (
    <aside
      className={clsx(
        'fixed left-0 top-0 h-screen bg-white border-r border-neutral-200',
        'dark:bg-neutral-800 dark:border-neutral-700',
        'transition-all duration-300 z-30',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo区域 */}
      <div className={clsx(
        'h-14 flex items-center border-b border-neutral-200 dark:border-neutral-700',
        sidebarCollapsed ? 'justify-center px-2' : 'px-4'
      )}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          {!sidebarCollapsed && (
            <span className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">
              企业管理系统
            </span>
          )}
        </div>
      </div>

      {/* 导航菜单 */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {filteredMenu.map(item => (
          <MenuItem
            key={item.key}
            item={item}
            collapsed={sidebarCollapsed}
            expandedKeys={expandedKeys}
            onToggleExpand={handleToggleExpand}
          />
        ))}
      </nav>

      {/* 折叠按钮 */}
      <div className="absolute bottom-4 left-0 right-0 px-2">
        <button
          className={clsx(
            'w-full flex items-center justify-center gap-2 py-2 rounded-lg',
            'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700',
            'transition-colors duration-150'
          )}
          onClick={toggleSidebar}
        >
          {sidebarCollapsed ? (
            <HiOutlineChevronRight className="w-5 h-5" />
          ) : (
            <>
              <HiOutlineChevronLeft className="w-5 h-5" />
              <span className="text-sm">收起菜单</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
