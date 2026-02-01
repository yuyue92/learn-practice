/**
 * 客户列表页面
 */

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '@/components/common/Table';
import Modal from '@/components/common/Modal';
import { toast } from '@/components/common/Toast';
import { getCustomerList, deleteCustomer, batchDeleteCustomers } from '@/api/modules/customer';
import { CUSTOMER_TYPE, CUSTOMER_LEVEL } from '@/config/constants';
import { exportCustomers, importFromCsv } from '@/utils/export';

function CustomerList() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [selectedRows, setSelectedRows] = useState([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  
  // 筛选条件
  const [filters, setFilters] = useState({
    keyword: '',
    type: '',
    level: '',
  });

  // 加载客户列表
  const loadCustomers = async (page = currentPage) => {
    try {
      setLoading(true);
      const result = await getCustomerList({
        page,
        pageSize,
        ...filters,
      });
      
      setCustomers(result.data || []);
      setTotal(result.total || 0);
      setCurrentPage(page);
    } catch (error) {
      toast.error('加载客户列表失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadCustomers(1);
  }, []);

  // 搜索
  const handleSearch = () => {
    loadCustomers(1);
  };

  // 重置筛选
  const handleReset = () => {
    setFilters({ keyword: '', type: '', level: '' });
    setTimeout(() => loadCustomers(1), 0);
  };

  // 查看详情
  const handleView = (record) => {
    navigate(`/app/customer/detail/${record.id}`);
  };

  // 编辑
  const handleEdit = (record) => {
    navigate(`/app/customer/edit/${record.id}`);
  };

  // 删除
  const handleDelete = (record) => {
    setDeleteTarget(record);
    setDeleteModalVisible(true);
  };

  // 确认删除
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    
    try {
      setDeleteLoading(true);
      await deleteCustomer(deleteTarget.id);
      toast.success('删除成功');
      setDeleteModalVisible(false);
      setDeleteTarget(null);
      loadCustomers();
    } catch (error) {
      toast.error('删除失败');
      console.error(error);
    } finally {
      setDeleteLoading(false);
    }
  };

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedRows.length === 0) {
      toast.warning('请先选择要删除的客户');
      return;
    }
    
    if (!window.confirm(`确定要删除选中的 ${selectedRows.length} 个客户吗？`)) {
      return;
    }

    try {
      await batchDeleteCustomers(selectedRows);
      toast.success('批量删除成功');
      setSelectedRows([]);
      loadCustomers();
    } catch (error) {
      toast.error('批量删除失败');
      console.error(error);
    }
  };

  // 导出数据
  const handleExport = () => {
    if (customers.length === 0) {
      toast.warning('没有可导出的数据');
      return;
    }
    
    const success = exportCustomers(customers);
    if (success) {
      toast.success('导出成功');
    } else {
      toast.error('导出失败');
    }
  };

  // 触发文件选择
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  // 导入数据
  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { data } = await importFromCsv(file);
      console.log('导入的数据:', data);
      toast.success(`成功解析 ${data.length} 条数据`);
      // TODO: 这里可以添加数据验证和保存逻辑
    } catch (error) {
      toast.error('导入失败: ' + error.message);
      console.error(error);
    }

    // 重置文件输入
    e.target.value = '';
  };

  // 表格列定义
  const columns = [
    {
      title: '客户编号',
      key: 'code',
      dataIndex: 'code',
      className: 'font-mono text-sm',
    },
    {
      title: '客户名称',
      key: 'name',
      dataIndex: 'name',
      render: (text, record) => (
        <button
          onClick={() => handleView(record)}
          className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
        >
          {text}
        </button>
      ),
    },
    {
      title: '客户类型',
      key: 'type',
      dataIndex: 'type',
      render: (value) => {
        const type = CUSTOMER_TYPE[value.toUpperCase()];
        if (!type) return value;
        return (
          <span className={`badge badge-${type.color}`}>
            {type.label}
          </span>
        );
      },
    },
    {
      title: '客户等级',
      key: 'level',
      dataIndex: 'level',
      render: (value) => {
        const level = CUSTOMER_LEVEL[value];
        if (!level) return value;
        return (
          <span className={`badge badge-${level.color}`}>
            {level.label}
          </span>
        );
      },
    },
    {
      title: '联系人',
      key: 'contact',
      dataIndex: 'contact',
      render: (contact) => contact.person,
    },
    {
      title: '联系电话',
      key: 'phone',
      dataIndex: 'contact',
      render: (contact) => contact.phone,
    },
    {
      title: '负责人',
      key: 'salesPerson',
      dataIndex: 'salesPersonName',
    },
    {
      title: '跟进次数',
      key: 'followUpCount',
      dataIndex: 'followUpCount',
      render: (count) => (
        <span className="text-neutral-900 dark:text-neutral-100 font-medium">
          {count} 次
        </span>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleView(record)}
            className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
          >
            查看
          </button>
          <button
            onClick={() => handleEdit(record)}
            className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
          >
            编辑
          </button>
          <button
            onClick={() => handleDelete(record)}
            className="text-sm text-danger-600 hover:text-danger-700 dark:text-danger-400"
          >
            删除
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="page-container">
      {/* 页面标题 */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title">客户管理</h1>
        <div className="flex items-center space-x-2">
          {selectedRows.length > 0 && (
            <button
              onClick={handleBatchDelete}
              className="btn btn-danger"
            >
              批量删除 ({selectedRows.length})
            </button>
          )}
          <button onClick={handleExport} className="btn btn-secondary">
            导出数据
          </button>
          <button onClick={handleImportClick} className="btn btn-secondary">
            导入数据
          </button>
          <button
            onClick={() => navigate('/app/customer/create')}
            className="btn btn-primary"
          >
            + 新增客户
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleImport}
            className="hidden"
          />
        </div>
      </div>

      {/* 筛选栏 */}
      <div className="card p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* 关键词搜索 */}
          <div>
            <input
              type="text"
              placeholder="搜索客户名称/编号/联系人"
              value={filters.keyword}
              onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="input"
            />
          </div>

          {/* 客户类型 */}
          <div>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="input"
            >
              <option value="">全部类型</option>
              {Object.values(CUSTOMER_TYPE).map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* 客户等级 */}
          <div>
            <select
              value={filters.level}
              onChange={(e) => setFilters({ ...filters, level: e.target.value })}
              className="input"
            >
              <option value="">全部等级</option>
              {Object.values(CUSTOMER_LEVEL).map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center space-x-2">
            <button onClick={handleSearch} className="btn btn-primary flex-1">
              搜索
            </button>
            <button onClick={handleReset} className="btn btn-secondary flex-1">
              重置
            </button>
          </div>
        </div>
      </div>

      {/* 数据表格 */}
      <div className="card p-6">
        <Table
          columns={columns}
          data={customers}
          loading={loading}
          total={total}
          pageSize={pageSize}
          onPageChange={loadCustomers}
          selectable
          onSelectionChange={setSelectedRows}
          emptyText="暂无客户数据"
        />
      </div>

      {/* 删除确认弹窗 */}
      <Modal
        visible={deleteModalVisible}
        title="删除确认"
        onClose={() => setDeleteModalVisible(false)}
        onOk={confirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
        loading={deleteLoading}
      >
        <p className="text-neutral-700 dark:text-neutral-300">
          确定要删除客户 <span className="font-bold">{deleteTarget?.name}</span> 吗？
        </p>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
          删除后将无法恢复，请谨慎操作！
        </p>
      </Modal>
    </div>
  );
}

export default CustomerList;
