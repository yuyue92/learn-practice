'use client'

import { useState } from 'react'
import { ChevronUp, ChevronDown, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'

interface Column<T = any> {
  key: string
  title: string
  dataIndex: string
  sortable?: boolean
  render?: (value: any, record: T, index: number) => React.ReactNode
  width?: string
  align?: 'left' | 'center' | 'right'
}

interface TableProps<T = any> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  pagination?: {
    current: number
    pageSize: number
    total: number
    onChange: (page: number, pageSize: number) => void
  }
  rowKey?: string | ((record: T) => string)
  className?: string
  onRowClick?: (record: T) => void
}

export function Table<T = any>({
  columns,
  data,
  loading = false,
  pagination,
  rowKey = 'id',
  className,
  onRowClick
}: TableProps<T>) {
  const [sortField, setSortField] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const sortedData = [...data].sort((a, b) => {
    if (!sortField) return 0
    
    const aValue = a[sortField as keyof T]
    const bValue = b[sortField as keyof T]
    
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
    return 0
  })

  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(record)
    }
    return (record as any)[rowKey] || index.toString()
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className={cn("overflow-hidden rounded-lg border border-gray-200 bg-white", className)}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={cn(
                    "px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider",
                    column.align === 'center' && "text-center",
                    column.align === 'right' && "text-right",
                    column.sortable && "cursor-pointer hover:bg-gray-100"
                  )}
                  style={column.width ? { width: column.width } : undefined}
                  onClick={column.sortable ? () => handleSort(column.dataIndex) : undefined}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.title}</span>
                    {column.sortable && (
                      <div className="flex flex-col">
                        <ChevronUp 
                          className={cn(
                            "h-3 w-3",
                            sortField === column.dataIndex && sortOrder === 'asc'
                              ? "text-blue-600" 
                              : "text-gray-400"
                          )} 
                        />
                        <ChevronDown 
                          className={cn(
                            "h-3 w-3 -mt-1",
                            sortField === column.dataIndex && sortOrder === 'desc'
                              ? "text-blue-600" 
                              : "text-gray-400"
                          )} 
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length} 
                  className="px-6 py-4 text-center text-gray-500"
                >
                  暂无数据
                </td>
              </tr>
            ) : (
              sortedData.map((record, index) => (
                <tr
                  key={getRowKey(record, index)}
                  className={cn(
                    "hover:bg-gray-50",
                    onRowClick && "cursor-pointer"
                  )}
                  onClick={() => onRowClick?.(record)}
                >
                  {columns.map((column) => {
                    const value = record[column.dataIndex as keyof T]
                    const content = column.render 
                      ? column.render(value, record, index)
                      : String(value || '')
                    
                    return (
                      <td
                        key={column.key}
                        className={cn(
                          "px-6 py-4 whitespace-nowrap text-sm text-gray-900",
                          column.align === 'center' && "text-center",
                          column.align === 'right' && "text-right"
                        )}
                      >
                        {content}
                      </td>
                    )
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {pagination && (
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={() => pagination.onChange(pagination.current - 1, pagination.pageSize)}
                disabled={pagination.current <= 1}
              >
                上一页
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => pagination.onChange(pagination.current + 1, pagination.pageSize)}
                disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
              >
                下一页
              </Button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  显示第 <span className="font-medium">{(pagination.current - 1) * pagination.pageSize + 1}</span> 到{' '}
                  <span className="font-medium">
                    {Math.min(pagination.current * pagination.pageSize, pagination.total)}
                  </span>{' '}
                  条，共 <span className="font-medium">{pagination.total}</span> 条记录
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => pagination.onChange(pagination.current - 1, pagination.pageSize)}
                    disabled={pagination.current <= 1}
                    className="rounded-l-md"
                  >
                    上一页
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => pagination.onChange(pagination.current + 1, pagination.pageSize)}
                    disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
                    className="rounded-r-md"
                  >
                    下一页
                  </Button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}