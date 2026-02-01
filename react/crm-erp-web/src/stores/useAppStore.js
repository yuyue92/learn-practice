/**
 * 应用全局状态管理
 * 管理侧边栏、全局加载状态等
 */

import { create } from 'zustand';

const useAppStore = create((set) => ({
  // 侧边栏是否折叠
  sidebarCollapsed: false,
  
  // 全局加载状态
  globalLoading: false,
  
  // 通知列表
  notifications: [],
  
  // 待办事项
  todos: [],
  
  // 切换侧边栏状态
  toggleSidebar: () => {
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
  },
  
  // 设置侧边栏状态
  setSidebarCollapsed: (collapsed) => {
    set({ sidebarCollapsed: collapsed });
  },
  
  // 设置全局加载状态
  setGlobalLoading: (loading) => {
    set({ globalLoading: loading });
  },
  
  // 添加通知
  addNotification: (notification) => {
    set((state) => ({
      notifications: [{ id: Date.now(), ...notification }, ...state.notifications],
    }));
  },
  
  // 移除通知
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },
  
  // 清空通知
  clearNotifications: () => {
    set({ notifications: [] });
  },
  
  // 设置待办事项
  setTodos: (todos) => {
    set({ todos });
  },
}));

export { useAppStore };
