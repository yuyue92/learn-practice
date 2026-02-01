/**
 * 路由配置
 */

import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores';
import MainLayout from '@/components/layout/MainLayout';
import Loading from '@/components/common/Loading';

// 懒加载页面组件
const Login = lazy(() => import('@/pages/auth/Login'));
const Dashboard = lazy(() => import('@/pages/dashboard'));
const CustomerList = lazy(() => import('@/pages/customer/List'));
const CustomerDetail = lazy(() => import('@/pages/customer/Detail'));
const CustomerForm = lazy(() => import('@/pages/customer/Form'));
const Unauthorized = lazy(() => import('@/pages/error/Unauthorized'));
const NotFound = lazy(() => import('@/pages/error/NotFound'));

// 页面加载组件
function PageLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loading />
    </div>
  );
}

// 受保护的路由组件
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// 路由组件
function Router() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Routes>
        {/* 公开路由 */}
        <Route path="/login" element={<Login />} />
        
        {/* 受保护的路由 */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* 仪表盘 */}
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* 客户管理 */}
          <Route path="customer">
            <Route path="list" element={<CustomerList />} />
            <Route path="detail/:id" element={<CustomerDetail />} />
            <Route path="create" element={<CustomerForm />} />
            <Route path="edit/:id" element={<CustomerForm />} />
            <Route index element={<Navigate to="list" replace />} />
          </Route>
          
          {/* 销售管理 */}
          <Route path="sales/*" element={<ComingSoon module="销售管理" />} />
          
          {/* 产品库存 */}
          <Route path="product/*" element={<ComingSoon module="产品库存" />} />
          
          {/* 采购管理 */}
          <Route path="purchase/*" element={<ComingSoon module="采购管理" />} />
          
          {/* 数据统计 */}
          <Route path="report/*" element={<ComingSoon module="数据统计" />} />
          
          {/* 系统配置 */}
          <Route path="system/*" element={<ComingSoon module="系统配置" />} />
          
          {/* 个人中心 */}
          <Route path="profile/*" element={<ComingSoon module="个人中心" />} />
          
          {/* 默认重定向到仪表盘 */}
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* 错误页面 */}
        <Route path="/403" element={<Unauthorized />} />
        <Route path="/404" element={<NotFound />} />

        {/* 根路径重定向 */}
        <Route path="/" element={<Navigate to="/app/dashboard" replace />} />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
}

// 敬请期待组件 (占位符)
function ComingSoon({ module }) {
  return (
    <div className="page-container">
      <div className="card p-12 text-center">
        <div className="text-6xl mb-4">🚧</div>
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
          {module}模块
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          功能开发中,敬请期待...
        </p>
      </div>
    </div>
  );
}

export default Router;
