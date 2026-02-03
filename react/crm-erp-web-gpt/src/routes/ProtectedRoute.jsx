import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore.js';
import { ROLE_PERMS } from '../permissions/rolePerms.js';
import { ROUTES } from '../constants/routes.js';

export default function ProtectedRoute({ children, routeKey }) {
  const token = useAuthStore((s) => s.tokenObj?.token);
  const user = useAuthStore((s) => s.user);

  if (!token) return <Navigate to={ROUTES.LOGIN} replace />;

  const perms = ROLE_PERMS[user?.role] || {};
  const ok = (perms.routes || []).includes(routeKey);
  if (!ok) return <Navigate to={ROUTES.FORBIDDEN} replace />;

  return children;
}
