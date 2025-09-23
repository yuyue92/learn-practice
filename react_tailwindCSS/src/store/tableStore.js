// src/store/tableStore.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useTableStore = create(
  persist(
    (set, get) => ({
      // --- state ---
      filters: {
        query: '',         // 模糊搜索
        role: 'all',       // 角色过滤
        status: 'all',     // 状态过滤
      },
      sort: { key: 'name', dir: 'asc' }, // 简单排序
      pagination: {
        page: 1,
        pageSize: 10,
      },

      // --- actions ---
      setFilter: (key, value) =>
        set((s) => ({
          filters: { ...s.filters, [key]: value },
          pagination: { ...s.pagination, page: 1 }, // 改筛选回到第1页
        })),

      resetFilters: () =>
        set((s) => ({
          filters: { query: '', role: 'all', status: 'all' },
          pagination: { ...s.pagination, page: 1 },
        })),

      setSort: (key) =>
        set((s) => {
          const dir =
            s.sort.key === key ? (s.sort.dir === 'asc' ? 'desc' : 'asc') : 'asc'
          return { sort: { key, dir } }
        }),

      setPage: (page) =>
        set((s) => ({ pagination: { ...s.pagination, page } })),

      setPageSize: (size) =>
        set((s) => ({
          pagination: { page: 1, pageSize: Number(size) || 10 }, // 改每页数回到第1页
        })),

      resetPaging: () =>
        set((s) => ({ pagination: { ...s.pagination, page: 1 } })),
    }),
    {
      name: 'table-ui', // localStorage key
      partialize: (s) => ({
        filters: s.filters,
        sort: s.sort,
        pagination: s.pagination,
      }),
    }
  )
)
