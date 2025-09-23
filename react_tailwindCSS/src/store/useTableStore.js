import { create } from "zustand"
import { persist } from "zustand/middleware"
persist
export const useTableStore = create(
    persist((set, get) => ({
        filters: { query: '', role: 'all', status: 'all' },
        sort: { key: 'name', dir: 'asc' },
        pagination: { page: 1, pageSize: 10 },

        setFilter: (key, value) =>
            set((s) => ({
                filters: { ...s.filters, [key]: value },
                pagination: { ...s.pagination, page: 1 }, // 改筛选回到第一页
            })),
        resetFilters: () =>
            set((s) => ({
                filters: { query: '', role: 'all', status: 'all' },
                pagination: { ...s.pagination, page: 1 },
            })),

        setSort: (key) =>
            set((s) => {
                const dir = s.sort.key === key ? (s.sort.dir === 'asc' ? 'desc' : 'asc') : 'asc'
                return { sort: { key, dir } }
            }),

        setPage: (page) =>
            set((s) => ({ pagination: { ...s.pagination, page } })),
        setPageSize: (size) =>
            set(() => ({ pagination: { page: 1, pageSize: Number(size) || 10 } })),
    }))
)