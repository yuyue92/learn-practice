/**
 * 表格组件
 * 企业级高性能表格，支持分页、排序、筛选、批量选择
 */
import { useState, useMemo, useCallback } from 'react';
import clsx from 'clsx';
import {
  HiOutlineChevronUp,
  HiOutlineChevronDown,
  HiOutlineSelector,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from 'react-icons/hi';
import { PAGINATION } from '@/constants/business';

/**
 * 表格组件
 */
const Table = ({
  columns = [],
  data = [],
  rowKey = 'id',
  loading = false,
  emptyText = '暂无数据',
  pagination,
  onPageChange,
  onPageSizeChange,
  sortField,
  sortOrder,
  onSortChange,
  selectable = false,
  selectedRowKeys = [],
  onSelectChange,
  onRowClick,
  rowClassName,
  stickyHeader = true,
  compact = false,
  className,
}) => {
  const allSelected = useMemo(() => {
    if (data.length === 0) return false;
    return data.every(row => selectedRowKeys.includes(row[rowKey]));
  }, [data, selectedRowKeys, rowKey]);

  const someSelected = useMemo(() => {
    if (data.length === 0) return false;
    return data.some(row => selectedRowKeys.includes(row[rowKey])) && !allSelected;
  }, [data, selectedRowKeys, rowKey, allSelected]);

  const handleSelectAll = useCallback(() => {
    if (allSelected) {
      onSelectChange?.([], []);
    } else {
      const allKeys = data.map(row => row[rowKey]);
      onSelectChange?.(allKeys, data);
    }
  }, [allSelected, data, rowKey, onSelectChange]);

  const handleSelectRow = useCallback((row) => {
    const key = row[rowKey];
    const isSelected = selectedRowKeys.includes(key);
    
    if (isSelected) {
      const newKeys = selectedRowKeys.filter(k => k !== key);
      const newRows = data.filter(r => newKeys.includes(r[rowKey]));
      onSelectChange?.(newKeys, newRows);
    } else {
      const newKeys = [...selectedRowKeys, key];
      const newRows = data.filter(r => newKeys.includes(r[rowKey]));
      onSelectChange?.(newKeys, newRows);
    }
  }, [selectedRowKeys, rowKey, data, onSelectChange]);

  const handleSort = useCallback((column) => {
    if (!column.sortable) return;
    
    const field = column.dataIndex || column.key;
    let newOrder = 'asc';
    
    if (sortField === field) {
      if (sortOrder === 'asc') {
        newOrder = 'desc';
      } else if (sortOrder === 'desc') {
        newOrder = null;
      }
    }
    
    onSortChange?.(newOrder ? field : null, newOrder);
  }, [sortField, sortOrder, onSortChange]);

  const renderSortIcon = (column) => {
    const field = column.dataIndex || column.key;
    const isActive = sortField === field;
    
    if (!column.sortable) return null;
    
    return (
      <span className="ml-1 inline-flex flex-col">
        {!isActive ? (
          <HiOutlineSelector className="w-4 h-4 text-neutral-400" />
        ) : sortOrder === 'asc' ? (
          <HiOutlineChevronUp className="w-4 h-4 text-primary-500" />
        ) : (
          <HiOutlineChevronDown className="w-4 h-4 text-primary-500" />
        )}
      </span>
    );
  };

  const getCellValue = (row, column) => {
    const dataIndex = column.dataIndex || column.key;
    const value = dataIndex.includes('.')
      ? dataIndex.split('.').reduce((obj, key) => obj?.[key], row)
      : row[dataIndex];
    
    if (column.render) {
      return column.render(value, row);
    }
    
    return value ?? '-';
  };

  const cellPadding = compact ? 'px-3 py-2' : 'px-4 py-3';

  return (
    <div className={clsx('w-full', className)}>
      <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-700">
        <table className="w-full text-sm">
          <thead className={clsx(
            'bg-neutral-50 dark:bg-neutral-800',
            stickyHeader && 'sticky top-0 z-10'
          )}>
            <tr>
              {selectable && (
                <th className={clsx(cellPadding, 'w-12')}>
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary-600 bg-white border-neutral-300 rounded focus:ring-primary-500 dark:bg-neutral-800 dark:border-neutral-600"
                    checked={allSelected}
                    ref={(el) => el && (el.indeterminate = someSelected)}
                    onChange={handleSelectAll}
                  />
                </th>
              )}
              
              {columns.map((column) => (
                <th
                  key={column.key || column.dataIndex}
                  className={clsx(
                    cellPadding,
                    'text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider',
                    'border-b border-neutral-200 dark:border-neutral-700 dark:text-neutral-400',
                    column.sortable && 'cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right'
                  )}
                  style={{ width: column.width, minWidth: column.minWidth }}
                  onClick={() => handleSort(column)}
                >
                  <span className="inline-flex items-center">
                    {column.title}
                    {renderSortIcon(column)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="text-center py-12"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-neutral-500">加载中...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="text-center py-12"
                >
                  <div className="flex flex-col items-center gap-2 text-neutral-500">
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <span>{emptyText}</span>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => {
                const key = row[rowKey];
                const isSelected = selectedRowKeys.includes(key);
                
                return (
                  <tr
                    key={key}
                    className={clsx(
                      'bg-white hover:bg-neutral-50 dark:bg-neutral-800 dark:hover:bg-neutral-750',
                      'transition-colors',
                      isSelected && 'bg-primary-50/50 dark:bg-primary-900/20',
                      onRowClick && 'cursor-pointer',
                      typeof rowClassName === 'function' ? rowClassName(row, rowIndex) : rowClassName
                    )}
                    onClick={() => onRowClick?.(row)}
                  >
                    {selectable && (
                      <td className={clsx(cellPadding, 'border-b border-neutral-200 dark:border-neutral-700')}>
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-primary-600 bg-white border-neutral-300 rounded focus:ring-primary-500 dark:bg-neutral-800 dark:border-neutral-600"
                          checked={isSelected}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleSelectRow(row);
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                    )}
                    
                    {columns.map((column) => (
                      <td
                        key={column.key || column.dataIndex}
                        className={clsx(
                          cellPadding,
                          'border-b border-neutral-200 dark:border-neutral-700',
                          'text-neutral-900 dark:text-neutral-100',
                          column.align === 'center' && 'text-center',
                          column.align === 'right' && 'text-right',
                          column.ellipsis && 'truncate max-w-[200px]'
                        )}
                        style={{ width: column.width, minWidth: column.minWidth }}
                        title={column.ellipsis ? String(getCellValue(row, column)) : undefined}
                      >
                        {getCellValue(row, column)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <Pagination
          {...pagination}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
  );
};

/**
 * 分页组件
 */
export const Pagination = ({
  page = 1,
  pageSize = PAGINATION.DEFAULT_PAGE_SIZE,
  total = 0,
  pageSizeOptions = PAGINATION.PAGE_SIZE_OPTIONS,
  onPageChange,
  onPageSizeChange,
  showTotal = true,
  showSizeChanger = true,
  className,
}) => {
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, total);

  const pageNumbers = useMemo(() => {
    const pages = [];
    const showPages = 5;
    
    let start = Math.max(1, page - Math.floor(showPages / 2));
    let end = Math.min(totalPages, start + showPages - 1);
    
    if (end - start < showPages - 1) {
      start = Math.max(1, end - showPages + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }, [page, totalPages]);

  if (total === 0) return null;

  return (
    <div className={clsx(
      'flex flex-wrap items-center justify-between gap-4 mt-4 text-sm',
      className
    )}>
      {showTotal && (
        <div className="text-neutral-500 dark:text-neutral-400">
          显示 {startIndex}-{endIndex} 条，共 {total} 条
        </div>
      )}

      <div className="flex items-center gap-2">
        {showSizeChanger && (
          <div className="flex items-center gap-2">
            <span className="text-neutral-500 dark:text-neutral-400">每页</span>
            <select
              className="px-2 py-1 border border-neutral-300 rounded-md bg-white dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-100"
              value={pageSize}
              onChange={(e) => onPageSizeChange?.(parseInt(e.target.value, 10))}
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            <span className="text-neutral-500 dark:text-neutral-400">条</span>
          </div>
        )}

        <div className="flex items-center gap-1">
          <button
            className={clsx(
              'p-1.5 rounded-md transition-colors',
              page <= 1
                ? 'text-neutral-300 cursor-not-allowed dark:text-neutral-600'
                : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700'
            )}
            disabled={page <= 1}
            onClick={() => onPageChange?.(page - 1)}
          >
            <HiOutlineChevronLeft className="w-4 h-4" />
          </button>

          {pageNumbers[0] > 1 && (
            <>
              <button
                className="px-3 py-1 rounded-md text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700"
                onClick={() => onPageChange?.(1)}
              >
                1
              </button>
              {pageNumbers[0] > 2 && (
                <span className="px-2 text-neutral-400">...</span>
              )}
            </>
          )}

          {pageNumbers.map((num) => (
            <button
              key={num}
              className={clsx(
                'px-3 py-1 rounded-md transition-colors',
                num === page
                  ? 'bg-primary-600 text-white'
                  : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700'
              )}
              onClick={() => onPageChange?.(num)}
            >
              {num}
            </button>
          ))}

          {pageNumbers[pageNumbers.length - 1] < totalPages && (
            <>
              {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                <span className="px-2 text-neutral-400">...</span>
              )}
              <button
                className="px-3 py-1 rounded-md text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700"
                onClick={() => onPageChange?.(totalPages)}
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            className={clsx(
              'p-1.5 rounded-md transition-colors',
              page >= totalPages
                ? 'text-neutral-300 cursor-not-allowed dark:text-neutral-600'
                : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700'
            )}
            disabled={page >= totalPages}
            onClick={() => onPageChange?.(page + 1)}
          >
            <HiOutlineChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Table;
