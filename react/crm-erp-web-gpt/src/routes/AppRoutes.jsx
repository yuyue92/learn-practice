import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ROUTES } from '../constants/routes.js';
import { useAuthStore } from '../stores/authStore.js';
import AppLayout from '../components/layout/AppLayout.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import Forbidden from '../pages/system/Forbidden.jsx';
import NotFound from '../pages/system/NotFound.jsx';

const Login = React.lazy(() => import('../pages/auth/Login.jsx'));
const Dashboard = React.lazy(() => import('../pages/dashboard/Dashboard.jsx'));
const Customers = React.lazy(() => import('../pages/customers/Customers.jsx'));
const CustomerDetail = React.lazy(() => import('../pages/customers/CustomerDetail.jsx'));
const Orders = React.lazy(() => import('../pages/sales/Orders.jsx'));
const Inventory = React.lazy(() => import('../pages/inventory/Inventory.jsx'));
const Purchase = React.lazy(() => import('../pages/purchase/Purchase.jsx'));
const Finance = React.lazy(() => import('../pages/finance/Finance.jsx'));
const Reports = React.lazy(() => import('../pages/reports/Reports.jsx'));
const Profile = React.lazy(() => import('../pages/me/Profile.jsx'));
const Users = React.lazy(() => import('../pages/admin/Users.jsx'));
const Config = React.lazy(() => import('../pages/admin/Config.jsx'));

export default function AppRoutes() {
  const bootstrapped = useAuthStore((s) => s.bootstrapped);
  const bootstrap = useAuthStore((s) => s.bootstrap);
  const token = useAuthStore((s) => s.tokenObj?.token);

  React.useEffect(() => { bootstrap(); }, [bootstrap]);

  if (!bootstrapped) return <div className="p-6 text-sm text-slate-500">初始化中…</div>;

  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={token ? <Navigate to={ROUTES.HOME} /> : <Login />} />

      <Route
        path={ROUTES.HOME}
        element={
          <ProtectedRoute routeKey="HOME">
            <AppLayout><Dashboard /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.CUSTOMERS}
        element={
          <ProtectedRoute routeKey="CUSTOMERS">
            <AppLayout><Customers /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.CUSTOMERS + '/:id'}
        element={
          <ProtectedRoute routeKey="CUSTOMERS">
            <AppLayout><CustomerDetail /></AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.ORDERS}
        element={
          <ProtectedRoute routeKey="SALES">
            <AppLayout><Orders /></AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.INVENTORY}
        element={
          <ProtectedRoute routeKey="INVENTORY">
            <AppLayout><Inventory /></AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.PURCHASE}
        element={
          <ProtectedRoute routeKey="PURCHASE">
            <AppLayout><Purchase /></AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.FINANCE}
        element={
          <ProtectedRoute routeKey="FINANCE">
            <AppLayout><Finance /></AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.REPORTS}
        element={
          <ProtectedRoute routeKey="REPORTS">
            <AppLayout><Reports /></AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.ME}
        element={
          <ProtectedRoute routeKey="ME">
            <AppLayout><Profile /></AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.ADMIN_USERS}
        element={
          <ProtectedRoute routeKey="ADMIN_USERS">
            <AppLayout><Users /></AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.ADMIN_CONFIG}
        element={
          <ProtectedRoute routeKey="ADMIN_CONFIG">
            <AppLayout><Config /></AppLayout>
          </ProtectedRoute>
        }
      />

      <Route path={ROUTES.FORBIDDEN} element={<Forbidden />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
