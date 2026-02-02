/**
 * 顶部栏组件
 * 包含搜索、通知、用户菜单等功能
 */
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import {
  HiOutlineSearch,
  HiOutlineBell,
  HiOutlineMoon,
  HiOutlineSun,
  HiOutlineUser,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineChevronDown,
} from 'react-icons/hi';
import { useThemeStore, useUserStore, useAppStore } from '@/stores';
import { ROUTES } from '@/constants/routes';
import { ROLE_NAMES } from '@/constants/permissions';
import { CountBadge } from '@/components/common';

/**
 * 顶部栏组件
 */
const Header = () => {
  const navigate = useNavigate();
  const { mode, toggleTheme, sidebarCollapsed } = useThemeStore();
  const { user, logout } = useUserStore();
  const { unreadCount, showSearch } = useAppStore();
  
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const userMenuRef = useRef(null);
  const notificationRef = useRef(null);

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + K 打开搜索
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        showSearch();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSearch]);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <header
      className={clsx(
        'fixed top-0 right-0 h-14 bg-white border-b border-neutral-200',
        'dark:bg-neutral-800 dark:border-neutral-700',
        'flex items-center justify-between px-6 z-20',
        'transition-all duration-300',
        sidebarCollapsed ? 'left-16' : 'left-64'
      )}
    >
      {/* 左侧：搜索框 */}
      <div className="flex items-center gap-4">
        <button
          className={clsx(
            'flex items-center gap-2 px-3 py-1.5 rounded-lg',
            'bg-neutral-100 text-neutral-500',
            'dark:bg-neutral-700 dark:text-neutral-400',
            'hover:bg-neutral-200 dark:hover:bg-neutral-600',
            'transition-colors duration-150'
          )}
          onClick={showSearch}
        >
          <HiOutlineSearch className="w-4 h-4" />
          <span className="text-sm">搜索...</span>
          <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 ml-2 text-xs bg-neutral-200 dark:bg-neutral-600 rounded">
            <span>⌘</span>
            <span>K</span>
          </kbd>
        </button>
      </div>

      {/* 右侧：功能按钮 */}
      <div className="flex items-center gap-2">
        {/* 主题切换 */}
        <button
          className={clsx(
            'p-2 rounded-lg text-neutral-500',
            'hover:bg-neutral-100 dark:hover:bg-neutral-700',
            'transition-colors duration-150'
          )}
          onClick={toggleTheme}
          title={mode === 'light' ? '切换到暗黑模式' : '切换到亮色模式'}
        >
          {mode === 'light' ? (
            <HiOutlineMoon className="w-5 h-5" />
          ) : (
            <HiOutlineSun className="w-5 h-5" />
          )}
        </button>

        {/* 通知 */}
        <div ref={notificationRef} className="relative">
          <button
            className={clsx(
              'p-2 rounded-lg text-neutral-500',
              'hover:bg-neutral-100 dark:hover:bg-neutral-700',
              'transition-colors duration-150'
            )}
            onClick={() => setNotificationOpen(!notificationOpen)}
          >
            <CountBadge count={unreadCount} max={99}>
              <HiOutlineBell className="w-5 h-5" />
            </CountBadge>
          </button>

          {/* 通知下拉 */}
          {notificationOpen && (
            <div className={clsx(
              'absolute right-0 mt-2 w-80 py-2',
              'bg-white border border-neutral-200 rounded-lg shadow-dropdown',
              'dark:bg-neutral-800 dark:border-neutral-700',
              'animate-fade-in'
            )}>
              <div className="px-4 py-2 border-b border-neutral-200 dark:border-neutral-700">
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                  通知
                </h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {unreadCount === 0 ? (
                  <div className="py-8 text-center text-neutral-500">
                    暂无新通知
                  </div>
                ) : (
                  <div className="py-2">
                    {/* 示例通知项 */}
                    <div className="px-4 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-700 cursor-pointer">
                      <p className="text-sm text-neutral-900 dark:text-neutral-100">
                        您有一个新的客户跟进提醒
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">
                        2分钟前
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="px-4 py-2 border-t border-neutral-200 dark:border-neutral-700">
                <button className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400">
                  查看全部
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 用户菜单 */}
        <div ref={userMenuRef} className="relative">
          <button
            className={clsx(
              'flex items-center gap-2 p-1.5 pr-3 rounded-lg',
              'hover:bg-neutral-100 dark:hover:bg-neutral-700',
              'transition-colors duration-150'
            )}
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          >
            <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <HiOutlineUser className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              )}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                {user?.name || '用户'}
              </p>
              <p className="text-xs text-neutral-500">
                {ROLE_NAMES[user?.role] || '未知角色'}
              </p>
            </div>
            <HiOutlineChevronDown className={clsx(
              'w-4 h-4 text-neutral-400 transition-transform duration-200',
              userMenuOpen && 'transform rotate-180'
            )} />
          </button>

          {/* 用户菜单下拉 */}
          {userMenuOpen && (
            <div className={clsx(
              'absolute right-0 mt-2 w-56 py-2',
              'bg-white border border-neutral-200 rounded-lg shadow-dropdown',
              'dark:bg-neutral-800 dark:border-neutral-700',
              'animate-fade-in'
            )}>
              <div className="px-4 py-2 border-b border-neutral-200 dark:border-neutral-700">
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {user?.name}
                </p>
                <p className="text-xs text-neutral-500">
                  {user?.email}
                </p>
              </div>
              
              <div className="py-1">
                <button
                  className={clsx(
                    'w-full flex items-center gap-3 px-4 py-2 text-sm',
                    'text-neutral-700 hover:bg-neutral-100',
                    'dark:text-neutral-300 dark:hover:bg-neutral-700',
                    'transition-colors duration-150'
                  )}
                  onClick={() => {
                    setUserMenuOpen(false);
                    navigate(ROUTES.PROFILE_INFO);
                  }}
                >
                  <HiOutlineUser className="w-4 h-4" />
                  个人中心
                </button>
                <button
                  className={clsx(
                    'w-full flex items-center gap-3 px-4 py-2 text-sm',
                    'text-neutral-700 hover:bg-neutral-100',
                    'dark:text-neutral-300 dark:hover:bg-neutral-700',
                    'transition-colors duration-150'
                  )}
                  onClick={() => {
                    setUserMenuOpen(false);
                    navigate(ROUTES.SYSTEM_CONFIG);
                  }}
                >
                  <HiOutlineCog className="w-4 h-4" />
                  系统设置
                </button>
              </div>
              
              <div className="border-t border-neutral-200 dark:border-neutral-700 pt-1">
                <button
                  className={clsx(
                    'w-full flex items-center gap-3 px-4 py-2 text-sm',
                    'text-danger-600 hover:bg-danger-50',
                    'dark:text-danger-400 dark:hover:bg-danger-900/20',
                    'transition-colors duration-150'
                  )}
                  onClick={handleLogout}
                >
                  <HiOutlineLogout className="w-4 h-4" />
                  退出登录
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
