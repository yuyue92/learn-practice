import { create } from 'zustand';
import { lsGet, lsSet } from '../utils/storage.js';

const KEY = 'crm_ui';

export const useUiStore = create((set, get) => ({
  theme: lsGet(KEY, {}).theme || 'light',
  setTheme: (theme) => {
    set({ theme });
    lsSet(KEY, { ...lsGet(KEY, {}), theme });
  },
  loadingCount: 0,
  showLoading: () => set({ loadingCount: get().loadingCount + 1 }),
  hideLoading: () => set({ loadingCount: Math.max(0, get().loadingCount - 1) })
}));
