import React, { useEffect, useMemo, useRef, useState } from 'react'
import { create } from 'zustand'

// ====== 内置 demo 数据（可用 <TableList rows={...}/> 覆盖）======
const DEFAULT_USERS = [
  { id: 1, name: 'Alice', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Bob', role: 'Editor', status: 'Active' },
  { id: 3, name: 'Charlie', role: 'Viewer', status: 'Inactive' },
  { id: 4, name: 'Diana', role: 'Editor', status: 'Active' },
  { id: 5, name: 'Evan', role: 'Viewer', status: 'Inactive' },
  { id: 6, name: 'Fiona', role: 'Admin', status: 'Active' },
  { id: 7, name: 'George', role: 'Viewer', status: 'Active' },
  { id: 8, name: 'Helen', role: 'Editor', status: 'Inactive' },
  { id: 9, name: 'Ivy', role: 'Viewer', status: 'Active' },
  { id: 10, name: 'Jack', role: 'Viewer', status: 'Active' },
  { id: 11, name: 'Ken', role: 'Admin', status: 'Inactive' },
  { id: 12, name: 'Lily', role: 'Editor', status: 'Active' },
  { id: 13, name: 'Mia', role: 'Viewer', status: 'Inactive' },
  { id: 14, name: 'Noah', role: 'Admin', status: 'Active' },
  { id: 15, name: 'Olivia', role: 'Viewer', status: 'Active' },
]

// ====== 本组件私有的 Zustand store（精简）======
const useTableStore = create((set, get) => ({
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

// ====== 合并后的 TableList 组件 ======
export default function TableList({ rows = DEFAULT_USERS, className = '' }) {
  // —— 状态订阅（分别订阅，避免返回新对象引发循环）——
  const filters = useTableStore((s) => s.filters)
  const sort = useTableStore((s) => s.sort)
  const page = useTableStore((s) => s.pagination.page)
  const pageSize = useTableStore((s) => s.pagination.pageSize)
  const setFilter = useTableStore((s) => s.setFilter)
  const resetFilters = useTableStore((s) => s.resetFilters)
  const setSort = useTableStore((s) => s.setSort)
  const setPage = useTableStore((s) => s.setPage)
  const setPageSize = useTableStore((s) => s.setPageSize)

  // —— 搜索输入防抖 —— 
  const [localQuery, setLocalQuery] = useState(filters.query)
  const timerRef = useRef()
  useEffect(() => { setLocalQuery(filters.query) }, [filters.query])
  useEffect(() => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      if (localQuery !== filters.query) setFilter('query', localQuery)
    }, 300)
    return () => clearTimeout(timerRef.current)
  }, [localQuery, filters.query, setFilter])

  // —— 过滤 —— 
  const filtered = useMemo(() => {
    let data = rows
    const q = (filters.query || '').trim().toLowerCase()
    if (q) data = data.filter(r => r.name.toLowerCase().includes(q))
    if (filters.role !== 'all') data = data.filter(r => r.role === filters.role)
    if (filters.status !== 'all') data = data.filter(r => r.status === filters.status)
    return data
  }, [rows, filters])

  // —— 排序 —— 
  const sorted = useMemo(() => {
    const { key, dir } = sort || {}
    if (!key) return filtered
    const copy = [...filtered]
    copy.sort((a, b) => {
      const av = (a[key] ?? '').toString().toLowerCase()
      const bv = (b[key] ?? '').toString().toLowerCase()
      if (av < bv) return dir === 'asc' ? -1 : 1
      if (av > bv) return dir === 'asc' ? 1 : -1
      return 0
    })
    return copy
  }, [filtered, sort])

  // —— 分页（渲染时防溢出）——
  const total = sorted.length
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const pageSafe = Math.min(page, pageCount) // 不回写 store，避免渲染期 setState
  const start = (pageSafe - 1) * pageSize
  const end = start + pageSize
  const pageRows = sorted.slice(start, end)

  // —— UI 样式 —— 
  const thBase = 'px-4 py-2 border-b cursor-pointer select-none hover:bg-gray-50 text-left'
  const tdBase = 'px-4 py-2 border-b'

  const renderSortArrow = (key) =>
    sort.key === key ? (sort.dir === 'asc' ? '▲' : '▼') : ' '

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 筛选区 */}
      <div className="rounded-lg border bg-white p-4">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-3">
          <div>
            <label className="block text-sm text-gray-600">搜索</label>
            <input
              className="w-64 border rounded px-3 py-2 outline-none"
              placeholder="按姓名模糊搜索"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">角色</label>
            <select
              className="border rounded px-3 py-2"
              value={filters.role}
              onChange={(e) => setFilter('role', e.target.value)}
            >
              <option value="all">全部</option>
              <option value="Admin">Admin</option>
              <option value="Editor">Editor</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600">状态</label>
            <select
              className="border rounded px-3 py-2"
              value={filters.status}
              onChange={(e) => setFilter('status', e.target.value)}
            >
              <option value="all">全部</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <button
            className="border px-3 py-2 rounded bg-gray-50 hover:bg-gray-100"
            onClick={resetFilters}
          >
            重置筛选
          </button>
        </div>
      </div>

      {/* 表格 */}
      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr className="text-gray-700">
              <th className={thBase} onClick={() => setSort('name')}>
                Name {renderSortArrow('name')}
              </th>
              <th className={thBase} onClick={() => setSort('role')}>
                Role {renderSortArrow('role')}
              </th>
              <th className={thBase} onClick={() => setSort('status')}>
                Status {renderSortArrow('status')}
              </th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((r) => (
              <tr key={r.id} className="odd:bg-white even:bg-gray-50">
                <td className={tdBase}>{r.name}</td>
                <td className={tdBase}>
                  <span
                    className={
                      'px-2 py-1 rounded text-xs ' +
                      (r.role === 'Admin'
                        ? 'bg-purple-100 text-purple-700'
                        : r.role === 'Editor'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-emerald-100 text-emerald-700')
                    }
                  >
                    {r.role}
                  </span>
                </td>
                <td className={tdBase}>
                  <span
                    className={
                      'px-2 py-1 rounded text-xs ' +
                      (r.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-gray-200 text-gray-700')
                    }
                  >
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}

            {pageRows.length === 0 && (
              <tr>
                <td className="px-4 py-8 text-center text-gray-500" colSpan={3}>
                  暂无数据
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 分页 */}
      <div className="rounded-lg border bg-white p-3">
        <div className="flex items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span>每页</span>
            <select
              className="border rounded px-2 py-1"
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value)}
            >
              {[5, 10, 20, 50].map((sz) => (
                <option key={sz} value={sz}>{sz}</option>
              ))}
            </select>
            <span className="text-gray-500">共 {total} 条</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="border rounded px-2 py-1 disabled:opacity-50"
              onClick={() => setPage(1)}
              disabled={pageSafe === 1}
            >
              « 第一页
            </button>
            <button
              className="border rounded px-2 py-1 disabled:opacity-50"
              onClick={() => setPage(Math.max(1, pageSafe - 1))}
              disabled={pageSafe === 1}
            >
              ‹ 上一页
            </button>
            <span className="px-2">第 {pageSafe} / {pageCount} 页</span>
            <button
              className="border rounded px-2 py-1 disabled:opacity-50"
              onClick={() => setPage(Math.min(pageCount, pageSafe + 1))}
              disabled={pageSafe >= pageCount}
            >
              下一页 ›
            </button>
            <button
              className="border rounded px-2 py-1 disabled:opacity-50"
              onClick={() => setPage(pageCount)}
              disabled={pageSafe >= pageCount}
            >
              最后一页 »
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
