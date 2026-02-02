/**
 * 认证Hook
 * 提供认证相关的便捷方法
 */
import { useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserStore } from '@/stores';
import { ROUTES } from '@/constants/routes';
import { hasPermission, canAccessMenu } from '@/constants/permissions';

/**
 * 认证Hook
 * @returns {Object} 认证相关方法和状态
 */
export const useAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const {
    user,
    isLoggedIn,
    loading,
    error,
    login: storeLogin,
    logout: storeLogout,
    checkAuth,
    updateUser,
    clearError,
  } = useUserStore();

  /**
   * 登录
   * @param {Object} credentials - 登录凭证
   * @param {boolean} rememberMe - 是否记住登录
   */
  const login = useCallback(async (credentials, rememberMe = false) => {
    try {
      await storeLogin(credentials, rememberMe);
      // 登录成功后跳转到之前的页面或首页
      const from = location.state?.from?.pathname || ROUTES.DASHBOARD;
      navigate(from, { replace: true });
    } catch (error) {
      throw error;
    }
  }, [storeLogin, navigate, location.state?.from?.pathname]);

  /**
   * 退出登录
   */
  const logout = useCallback(() => {
    storeLogout();
    navigate(ROUTES.LOGIN, { replace: true });
  }, [storeLogout, navigate]);

  /**
   * 检查是否有指定权限
   * @param {string|string[]} permission - 权限或权限数组
   * @returns {boolean}
   */
  const checkPermission = useCallback((permission) => {
    if (!user) return false;
    return hasPermission(user.role, permission);
  }, [user]);

  /**
   * 检查是否可以访问指定菜单
   * @param {string} menuKey - 菜单key
   * @returns {boolean}
   */
  const checkMenuAccess = useCallback((menuKey) => {
    if (!user) return false;
    return canAccessMenu(user.role, menuKey);
  }, [user]);

  /**
   * 要求登录的路由守卫
   */
  const requireAuth = useCallback(() => {
    if (!isLoggedIn) {
      navigate(ROUTES.LOGIN, {
        replace: true,
        state: { from: location },
      });
      return false;
    }
    return true;
  }, [isLoggedIn, navigate, location]);

  /**
   * 要求指定权限的路由守卫
   * @param {string|string[]} permission - 权限或权限数组
   */
  const requirePermission = useCallback((permission) => {
    if (!requireAuth()) return false;
    
    if (!checkPermission(permission)) {
      navigate(ROUTES.FORBIDDEN, { replace: true });
      return false;
    }
    return true;
  }, [requireAuth, checkPermission, navigate]);

  // 初始化时检查登录状态
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    isLoggedIn,
    loading,
    error,
    login,
    logout,
    checkPermission,
    checkMenuAccess,
    requireAuth,
    requirePermission,
    updateUser,
    clearError,
    // 便捷属性
    isAdmin: user?.role === 'super_admin',
    isSalesDirector: user?.role === 'sales_director',
    isSalesStaff: user?.role === 'sales_staff',
    isWarehouse: user?.role === 'warehouse',
    isPurchaser: user?.role === 'purchaser',
    isFinance: user?.role === 'finance',
    isEmployee: user?.role === 'employee',
    role: user?.role,
    userId: user?.id,
    userName: user?.name,
  };
};

export default useAuth;
