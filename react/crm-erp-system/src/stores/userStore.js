/**
 * 用户状态管理
 * 使用Zustand管理用户信息、认证状态
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { config } from '@/config';
import { hasPermission } from '@/constants/permissions';
import { getToken, setToken, removeToken, getUserInfo, setUserInfo, clearAuth } from '@/utils/auth';

/**
 * 用户状态Store
 */
const useUserStore = create(
  persist(
    (set, get) => ({
      // 用户信息
      user: null,
      // 登录状态
      isLoggedIn: false,
      // 加载状态
      loading: false,
      // 错误信息
      error: null,

      /**
       * 登录
       * @param {Object} credentials - 登录凭证
       * @param {boolean} rememberMe - 是否记住登录
       */
      login: async (credentials, rememberMe = false) => {
        set({ loading: true, error: null });
        
        try {
          // 模拟登录API调用
          // 实际项目中应该调用后端接口
          const mockUsers = [
            {
              id: '1',
              username: 'admin',
              password: 'admin123',
              name: '超级管理员',
              role: 'super_admin',
              avatar: '',
              email: 'admin@company.com',
              phone: '13800138000',
              department: '管理层',
            },
            {
              id: '2',
              username: 'sales_director',
              password: '123456',
              name: '张总监',
              role: 'sales_director',
              avatar: '',
              email: 'zhang@company.com',
              phone: '13800138001',
              department: '销售部',
            },
            {
              id: '3',
              username: 'sales',
              password: '123456',
              name: '李销售',
              role: 'sales_staff',
              avatar: '',
              email: 'li@company.com',
              phone: '13800138002',
              department: '销售部',
            },
            {
              id: '4',
              username: 'warehouse',
              password: '123456',
              name: '王库管',
              role: 'warehouse',
              avatar: '',
              email: 'wang@company.com',
              phone: '13800138003',
              department: '仓储部',
            },
            {
              id: '5',
              username: 'purchaser',
              password: '123456',
              name: '赵采购',
              role: 'purchaser',
              avatar: '',
              email: 'zhao@company.com',
              phone: '13800138004',
              department: '采购部',
            },
            {
              id: '6',
              username: 'finance',
              password: '123456',
              name: '钱财务',
              role: 'finance',
              avatar: '',
              email: 'qian@company.com',
              phone: '13800138005',
              department: '财务部',
            },
            {
              id: '7',
              username: 'employee',
              password: '123456',
              name: '孙员工',
              role: 'employee',
              avatar: '',
              email: 'sun@company.com',
              phone: '13800138006',
              department: '行政部',
            },
          ];
          
          // 模拟延迟
          await new Promise(resolve => setTimeout(resolve, 800));
          
          const user = mockUsers.find(
            u => u.username === credentials.username && u.password === credentials.password
          );
          
          if (!user) {
            throw new Error('用户名或密码错误');
          }
          
          // 生成模拟token
          const token = btoa(JSON.stringify({ userId: user.id, timestamp: Date.now() }));
          
          // 保存token
          setToken(token, rememberMe);
          
          // 移除密码字段
          const { password, ...userInfo } = user;
          
          // 保存用户信息
          setUserInfo(userInfo);
          
          set({
            user: userInfo,
            isLoggedIn: true,
            loading: false,
            error: null,
          });
          
          return userInfo;
        } catch (error) {
          set({
            loading: false,
            error: error.message,
          });
          throw error;
        }
      },

      /**
       * 退出登录
       */
      logout: () => {
        clearAuth();
        set({
          user: null,
          isLoggedIn: false,
          loading: false,
          error: null,
        });
      },

      /**
       * 检查登录状态
       */
      checkAuth: () => {
        const token = getToken();
        const user = getUserInfo();
        
        if (token && user) {
          set({
            user,
            isLoggedIn: true,
          });
          return true;
        }
        
        set({
          user: null,
          isLoggedIn: false,
        });
        return false;
      },

      /**
       * 更新用户信息
       * @param {Object} updates - 更新的字段
       */
      updateUser: (updates) => {
        const currentUser = get().user;
        if (!currentUser) return;
        
        const updatedUser = { ...currentUser, ...updates };
        setUserInfo(updatedUser);
        set({ user: updatedUser });
      },

      /**
       * 检查是否有指定权限
       * @param {string|string[]} permission - 权限或权限数组
       * @returns {boolean}
       */
      hasPermission: (permission) => {
        const user = get().user;
        if (!user) return false;
        return hasPermission(user.role, permission);
      },

      /**
       * 清除错误
       */
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: config.storage.userKey,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);

export default useUserStore;
