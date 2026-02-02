/**
 * 主应用组件
 * 路由配置与全局组件挂载
 */
import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUserStore, useThemeStore } from '@/stores';
import { MainLayout } from '@/components/layout';
import { ROUTES } from '@/constants/routes';
import { ForbiddenPage, NotFoundPage } from '@/pages/common/ErrorPages';

// 懒加载页面
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'));

// 创建QueryClient实例
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

// 加载状态组件
const PageLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-neutral-500">页面加载中...</p>
    </div>
  </div>
);

// 路由守卫组件
const AuthGuard = ({ children }) => {
  const { isLoggedIn, checkAuth } = useUserStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (!isLoggedIn) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return children;
};

// 访客路由守卫
const GuestGuard = ({ children }) => {
  const { isLoggedIn } = useUserStore();
  if (isLoggedIn) return <Navigate to={ROUTES.DASHBOARD} replace />;
  return children;
};

// 占位页面
const PlaceholderPage = ({ title }) => (
  <div className="card p-12 text-center">
    <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">{title}</h2>
    <p className="text-neutral-500">该模块正在开发中，敬请期待...</p>
  </div>
);

// 主应用
const App = () => {
  const { initTheme } = useThemeStore();
  useEffect(() => { initTheme(); }, [initTheme]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<PageLoading />}>
          <Routes>
            <Route path={ROUTES.LOGIN} element={<GuestGuard><LoginPage /></GuestGuard>} />
            
            <Route element={<AuthGuard><MainLayout /></AuthGuard>}>
              <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
              <Route path="/customer/*" element={<PlaceholderPage title="客户管理" />} />
              <Route path="/sales/*" element={<PlaceholderPage title="销售管理" />} />
              <Route path="/product/*" element={<PlaceholderPage title="产品管理" />} />
              <Route path="/inventory/*" element={<PlaceholderPage title="库存管理" />} />
              <Route path="/purchase/*" element={<PlaceholderPage title="采购管理" />} />
              <Route path="/statistics/*" element={<PlaceholderPage title="数据统计" />} />
              <Route path="/system/*" element={<PlaceholderPage title="系统管理" />} />
              <Route path="/profile/*" element={<PlaceholderPage title="个人中心" />} />
            </Route>
            
            <Route path={ROUTES.FORBIDDEN} element={<ForbiddenPage />} />
            <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to={ROUTES.NOT_FOUND} replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
