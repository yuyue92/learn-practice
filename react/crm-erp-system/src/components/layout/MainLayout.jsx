/**
 * 主布局组件
 * 包含侧边栏、顶部栏和内容区域
 */
import { Outlet } from 'react-router-dom';
import clsx from 'clsx';
import { useThemeStore, useAppStore } from '@/stores';
import Sidebar from './Sidebar';
import Header from './Header';
import GlobalSearch from './GlobalSearch';
import LoadingOverlay from './LoadingOverlay';

/**
 * 主布局组件
 */
const MainLayout = () => {
  const { sidebarCollapsed } = useThemeStore();
  const { globalLoading, loadingText, searchVisible } = useAppStore();

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* 侧边栏 */}
      <Sidebar />

      {/* 顶部栏 */}
      <Header />

      {/* 主内容区 */}
      <main
        className={clsx(
          'min-h-screen pt-14 transition-all duration-300',
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        )}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>

      {/* 全局搜索 */}
      {searchVisible && <GlobalSearch />}

      {/* 全局加载遮罩 */}
      {globalLoading && <LoadingOverlay text={loadingText} />}
    </div>
  );
};

export default MainLayout;
