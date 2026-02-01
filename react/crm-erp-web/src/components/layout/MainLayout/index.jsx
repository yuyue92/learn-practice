/**
 * 主布局组件
 */

import { Outlet } from 'react-router-dom';
import { useAppStore, useAuthStore, useThemeStore } from '@/stores';
import Header from '../Header';
import Sidebar from '../Sidebar';

function MainLayout() {
  const { sidebarCollapsed } = useAppStore();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div className="h-full flex bg-neutral-50 dark:bg-neutral-900">
      {/* 侧边栏 */}
      <Sidebar />

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 顶部导航 */}
        <Header
          user={user}
          theme={theme}
          onToggleTheme={toggleTheme}
          onLogout={logout}
        />

        {/* 页面内容 */}
        <main className="flex-1 overflow-auto custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
