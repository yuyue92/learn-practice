/**
 * 全局应用状态管理
 * 管理全局加载、通知、搜索等状态
 */
import { create } from 'zustand';

/**
 * 全局应用状态Store
 */
const useAppStore = create((set, get) => ({
  // 全局加载状态
  globalLoading: false,
  loadingText: '加载中...',
  
  // 全局搜索
  searchVisible: false,
  searchKeyword: '',
  recentSearches: [],
  
  // 待办提醒
  reminders: [],
  unreadCount: 0,
  
  // 系统配置（从后端获取）
  systemConfig: {
    companyName: '企业管理系统',
    systemTitle: 'CRM/ERP管理平台',
    defaultWarningThreshold: 10,
    logo: '',
  },

  /**
   * 设置全局加载状态
   * @param {boolean} loading - 是否加载中
   * @param {string} text - 加载提示文本
   */
  setGlobalLoading: (loading, text = '加载中...') => {
    set({ globalLoading: loading, loadingText: text });
  },

  /**
   * 显示全局搜索
   */
  showSearch: () => {
    set({ searchVisible: true });
  },

  /**
   * 隐藏全局搜索
   */
  hideSearch: () => {
    set({ searchVisible: false, searchKeyword: '' });
  },

  /**
   * 设置搜索关键词
   * @param {string} keyword - 搜索关键词
   */
  setSearchKeyword: (keyword) => {
    set({ searchKeyword: keyword });
  },

  /**
   * 添加搜索历史
   * @param {string} keyword - 搜索关键词
   */
  addRecentSearch: (keyword) => {
    if (!keyword.trim()) return;
    
    const { recentSearches } = get();
    const filtered = recentSearches.filter(k => k !== keyword);
    const newSearches = [keyword, ...filtered].slice(0, 10);
    
    set({ recentSearches: newSearches });
    localStorage.setItem('crm_erp_recent_search', JSON.stringify(newSearches));
  },

  /**
   * 清除搜索历史
   */
  clearRecentSearches: () => {
    set({ recentSearches: [] });
    localStorage.removeItem('crm_erp_recent_search');
  },

  /**
   * 加载搜索历史
   */
  loadRecentSearches: () => {
    try {
      const saved = localStorage.getItem('crm_erp_recent_search');
      if (saved) {
        set({ recentSearches: JSON.parse(saved) });
      }
    } catch (e) {
      console.error('Failed to load recent searches:', e);
    }
  },

  /**
   * 设置提醒列表
   * @param {Array} reminders - 提醒列表
   */
  setReminders: (reminders) => {
    const unreadCount = reminders.filter(r => !r.read).length;
    set({ reminders, unreadCount });
  },

  /**
   * 添加提醒
   * @param {Object} reminder - 提醒信息
   */
  addReminder: (reminder) => {
    const { reminders } = get();
    const newReminder = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      read: false,
      ...reminder,
    };
    const newReminders = [newReminder, ...reminders];
    set({
      reminders: newReminders,
      unreadCount: newReminders.filter(r => !r.read).length,
    });
  },

  /**
   * 标记提醒为已读
   * @param {string} id - 提醒ID
   */
  markReminderAsRead: (id) => {
    const { reminders } = get();
    const newReminders = reminders.map(r =>
      r.id === id ? { ...r, read: true } : r
    );
    set({
      reminders: newReminders,
      unreadCount: newReminders.filter(r => !r.read).length,
    });
  },

  /**
   * 标记所有提醒为已读
   */
  markAllRemindersAsRead: () => {
    const { reminders } = get();
    const newReminders = reminders.map(r => ({ ...r, read: true }));
    set({ reminders: newReminders, unreadCount: 0 });
  },

  /**
   * 删除提醒
   * @param {string} id - 提醒ID
   */
  removeReminder: (id) => {
    const { reminders } = get();
    const newReminders = reminders.filter(r => r.id !== id);
    set({
      reminders: newReminders,
      unreadCount: newReminders.filter(r => !r.read).length,
    });
  },

  /**
   * 设置系统配置
   * @param {Object} config - 系统配置
   */
  setSystemConfig: (config) => {
    set({ systemConfig: { ...get().systemConfig, ...config } });
  },

  /**
   * 重置应用状态
   */
  resetAppState: () => {
    set({
      globalLoading: false,
      loadingText: '加载中...',
      searchVisible: false,
      searchKeyword: '',
      reminders: [],
      unreadCount: 0,
    });
  },
}));

export default useAppStore;
