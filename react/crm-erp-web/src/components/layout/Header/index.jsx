/**
 * 顶部导航组件
 */

import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/stores';

function Header({ user, theme, onToggleTheme, onLogout }) {
  const navigate = useNavigate();
  const { toggleSidebar } = useAppStore();

  return (
    <header className="h-16 bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between px-6 no-print">
      {/* 左侧 */}
      <div className="flex items-center space-x-4">
        {/* 折叠按钮 */}
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
          aria-label="Toggle sidebar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* 系统标题 */}
        <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
          CRM/ERP 系统
        </h1>
      </div>

      {/* 右侧 */}
      <div className="flex items-center space-x-4">
        {/* 主题切换 */}
        <button
          onClick={onToggleTheme}
          className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        {/* 用户菜单 */}
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
              {user?.realName || user?.username}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {user?.roleName}
            </p>
          </div>
          
          <button
            onClick={onLogout}
            className="btn btn-secondary text-sm"
          >
            退出
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
