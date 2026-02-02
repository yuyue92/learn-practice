/**
 * 表格Hook
 * 提供表格通用功能：分页、排序、筛选、选择
 */
import { useState, useCallback, useMemo } from 'react';
import { PAGINATION } from '@/constants/business';

/**
 * 表格Hook
 * @param {Object} options - 配置项
 * @returns {Object} 表格相关状态和方法
 */
export const useTable = (options = {}) => {
  const {
    defaultPageSize = PAGINATION.DEFAULT_PAGE_SIZE,
    defaultPage = PAGINATION.DEFAULT_PAGE,
    defaultSortField = null,
    defaultSortOrder = 'asc',
  } = options;

  // 分页状态
  const [pagination, setPagination] = useState({
    page: defaultPage,
    pageSize: defaultPageSize,
    total: 0,
  });

  // 排序状态
  const [sort, setSort] = useState({
    field: defaultSortField,
    order: defaultSortOrder,
  });

  // 筛选状态
  const [filters, setFilters] = useState({});

  // 选中行
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // 加载状态
  const [loading, setLoading] = useState(false);

  /**
   * 改变页码
   * @param {number} page - 页码
   */
  const onPageChange = useCallback((page) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  /**
   * 改变每页条数
   * @param {number} pageSize - 每页条数
   */
  const onPageSizeChange = useCallback((pageSize) => {
    setPagination(prev => ({ ...prev, pageSize, page: 1 }));
  }, []);

  /**
   * 设置总数
   * @param {number} total - 总数
   */
  const setTotal = useCallback((total) => {
    setPagination(prev => ({ ...prev, total }));
  }, []);

  /**
   * 重置分页
   */
  const resetPagination = useCallback(() => {
    setPagination({
      page: defaultPage,
      pageSize: defaultPageSize,
      total: 0,
    });
  }, [defaultPage, defaultPageSize]);

  /**
   * 改变排序
   * @param {string} field - 排序字段
   * @param {string} order - 排序方向
   */
  const onSortChange = useCallback((field, order) => {
    setSort({ field, order });
    // 排序改变时重置到第一页
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  /**
   * 切换排序
   * @param {string} field - 排序字段
   */
  const toggleSort = useCallback((field) => {
    setSort(prev => {
      if (prev.field !== field) {
        return { field, order: 'asc' };
      }
      if (prev.order === 'asc') {
        return { field, order: 'desc' };
      }
      return { field: null, order: 'asc' };
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  /**
   * 重置排序
   */
  const resetSort = useCallback(() => {
    setSort({ field: defaultSortField, order: defaultSortOrder });
  }, [defaultSortField, defaultSortOrder]);

  /**
   * 设置筛选条件
   * @param {Object} newFilters - 筛选条件
   */
  const onFilterChange = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    // 筛选改变时重置到第一页
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  /**
   * 重置筛选条件
   */
  const resetFilters = useCallback(() => {
    setFilters({});
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  /**
   * 选择行
   * @param {Array} keys - 选中的key数组
   * @param {Array} rows - 选中的行数据数组
   */
  const onSelectChange = useCallback((keys, rows) => {
    setSelectedRowKeys(keys);
    setSelectedRows(rows);
  }, []);

  /**
   * 选择单行
   * @param {any} key - 行key
   * @param {Object} row - 行数据
   * @param {boolean} selected - 是否选中
   */
  const onSelectRow = useCallback((key, row, selected) => {
    if (selected) {
      setSelectedRowKeys(prev => [...prev, key]);
      setSelectedRows(prev => [...prev, row]);
    } else {
      setSelectedRowKeys(prev => prev.filter(k => k !== key));
      setSelectedRows(prev => prev.filter(r => r !== row));
    }
  }, []);

  /**
   * 全选/取消全选
   * @param {boolean} selected - 是否全选
   * @param {Array} allRows - 所有行数据
   * @param {Function} getRowKey - 获取行key的函数
   */
  const onSelectAll = useCallback((selected, allRows, getRowKey = (row) => row.id) => {
    if (selected) {
      const allKeys = allRows.map(getRowKey);
      setSelectedRowKeys(allKeys);
      setSelectedRows(allRows);
    } else {
      setSelectedRowKeys([]);
      setSelectedRows([]);
    }
  }, []);

  /**
   * 清除选择
   */
  const clearSelection = useCallback(() => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
  }, []);

  /**
   * 检查是否选中
   * @param {any} key - 行key
   * @returns {boolean}
   */
  const isSelected = useCallback((key) => {
    return selectedRowKeys.includes(key);
  }, [selectedRowKeys]);

  /**
   * 重置所有状态
   */
  const resetAll = useCallback(() => {
    resetPagination();
    resetSort();
    resetFilters();
    clearSelection();
  }, [resetPagination, resetSort, resetFilters, clearSelection]);

  // 计算属性
  const hasSelection = useMemo(() => selectedRowKeys.length > 0, [selectedRowKeys]);
  const selectionCount = useMemo(() => selectedRowKeys.length, [selectedRowKeys]);

  // 查询参数（用于API请求）
  const queryParams = useMemo(() => ({
    page: pagination.page,
    pageSize: pagination.pageSize,
    sortField: sort.field,
    sortOrder: sort.order,
    ...filters,
  }), [pagination.page, pagination.pageSize, sort.field, sort.order, filters]);

  return {
    // 分页
    pagination,
    onPageChange,
    onPageSizeChange,
    setTotal,
    resetPagination,
    
    // 排序
    sort,
    onSortChange,
    toggleSort,
    resetSort,
    
    // 筛选
    filters,
    onFilterChange,
    resetFilters,
    
    // 选择
    selectedRows,
    selectedRowKeys,
    onSelectChange,
    onSelectRow,
    onSelectAll,
    clearSelection,
    isSelected,
    hasSelection,
    selectionCount,
    
    // 加载
    loading,
    setLoading,
    
    // 工具
    resetAll,
    queryParams,
  };
};

export default useTable;
