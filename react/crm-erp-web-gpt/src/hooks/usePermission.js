import { useAuthStore } from '../stores/authStore.js';
import { ROLE_PERMS } from '../permissions/rolePerms.js';

export function usePermission() {
  const user = useAuthStore((s) => s.user);
  const role = user?.role;
  const perms = ROLE_PERMS[role] || {};
  function can(feature) { return Boolean(perms.features?.includes(feature)); }
  function canRoute(routeKey) { return Boolean(perms.routes?.includes(routeKey)); }
  return { role, can, canRoute };
}
