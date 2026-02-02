/**
 * 主题状态管理
 * 使用Zustand管理主题模式、侧边栏状态等UI配置
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { config } from '@/config';

/**
 * 应用主题类到HTML元素
 * @param {string} mode - 主题模式
 */
const applyTheme = (mode) => {
  const root = document.documentElement;
  if (mode === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

/**
 * 主题状态Store
 */
const useThemeStore = create(
  persist(
    (set, get) => ({
      // 主题模式：light | dark
      mode: config.theme.defaultMode,
      // 侧边栏是否折叠
      sidebarCollapsed: false,
      // 是否显示页面标签
      showTabs: true,
      // 主色调
      primaryColor: '#3b82f6',
      // 紧凑模式
      compactMode: false,

      /**
       * 切换主题模式
       */
      toggleTheme: () => {
        const newMode = get().mode === 'light' ? 'dark' : 'light';
        applyTheme(newMode);
        set({ mode: newMode });
      },

      /**
       * 设置主题模式
       * @param {string} mode - 主题模式
       */
      setTheme: (mode) => {
        applyTheme(mode);
        set({ mode });
      },

      /**
       * 切换侧边栏折叠状态
       */
      toggleSidebar: () => {
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
      },

      /**
       * 设置侧边栏折叠状态
       * @param {boolean} collapsed - 是否折叠
       */
      setSidebarCollapsed: (collapsed) => {
        set({ sidebarCollapsed: collapsed });
      },

      /**
       * 切换页面标签显示
       */
      toggleTabs: () => {
        set((state) => ({ showTabs: !state.showTabs }));
      },

      /**
       * 设置主色调
       * @param {string} color - 颜色值
       */
      setPrimaryColor: (color) => {
        set({ primaryColor: color });
        document.documentElement.style.setProperty('--color-primary', color);
      },

      /**
       * 切换紧凑模式
       */
      toggleCompactMode: () => {
        set((state) => ({ compactMode: !state.compactMode }));
      },

      /**
       * 初始化主题
       */
      initTheme: () => {
        const { mode } = get();
        applyTheme(mode);
      },

      /**
       * 重置为默认设置
       */
      resetSettings: () => {
        const defaultSettings = {
          mode: config.theme.defaultMode,
          sidebarCollapsed: false,
          showTabs: true,
          primaryColor: '#3b82f6',
          compactMode: false,
        };
        applyTheme(defaultSettings.mode);
        set(defaultSettings);
      },
    }),
    {
      name: config.storage.settingsKey,
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyTheme(state.mode);
        }
      },
    }
  )
);

export default useThemeStore;
