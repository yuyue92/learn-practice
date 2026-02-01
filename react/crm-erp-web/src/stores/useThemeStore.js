/**
 * 主题状态管理
 * 使用 Zustand 管理系统主题 (亮色/暗黑模式)
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useThemeStore = create(
  persist(
    (set, get) => ({
      // 状态
      theme: 'light', // 'light' | 'dark'
      
      // 设置主题
      setTheme: (theme) => {
        set({ theme });
      },
      
      // 切换主题
      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme });
      },
      
      // 初始化主题
      initTheme: () => {
        const savedTheme = get().theme;
        if (savedTheme) {
          set({ theme: savedTheme });
        } else {
          // 检测系统主题偏好
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          set({ theme: prefersDark ? 'dark' : 'light' });
        }
      },
    }),
    {
      name: 'theme-storage', // localStorage key
    }
  )
);

export { useThemeStore };
