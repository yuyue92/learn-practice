/**
 * 认证状态管理
 * 使用 Zustand 管理用户登录状态和信息
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY || 'crm_erp_token';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // 状态
      user: null,
      token: null,
      isAuthenticated: false,
      
      // 设置用户信息
      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },
      
      // 设置 Token
      setToken: (token) => {
        set({ token });
        if (token) {
          Cookies.set(TOKEN_KEY, token, { expires: 7 }); // 7天有效期
        } else {
          Cookies.remove(TOKEN_KEY);
        }
      },
      
      // 登录
      login: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: true,
        });
        Cookies.set(TOKEN_KEY, token, { expires: 7 });
      },
      
      // 退出登录
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        Cookies.remove(TOKEN_KEY);
        // 清除本地存储的其他数据
        localStorage.clear();
      },
      
      // 更新用户信息
      updateUser: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...updates },
          });
        }
      },
      
      // 检查是否已登录
      checkAuth: () => {
        const token = get().token || Cookies.get(TOKEN_KEY);
        return !!token;
      },
      
      // 获取 Token
      getToken: () => {
        return get().token || Cookies.get(TOKEN_KEY);
      },
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export { useAuthStore };
