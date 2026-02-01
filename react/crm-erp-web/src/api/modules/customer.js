/**
 * 客户管理 API 接口
 */

import { get, post, put, del } from '@/utils/request';

// 客户列表
export const getCustomerList = (params) => {
  return get('/customers', params);
};

// 客户详情
export const getCustomerDetail = (id) => {
  return get(`/customers/${id}`);
};

// 创建客户
export const createCustomer = (data) => {
  return post('/customers', data);
};

// 更新客户
export const updateCustomer = (id, data) => {
  return put(`/customers/${id}`, data);
};

// 删除客户
export const deleteCustomer = (id) => {
  return del(`/customers/${id}`);
};

// 批量删除客户
export const batchDeleteCustomers = (ids) => {
  return post('/customers/batch-delete', { ids });
};

// 客户导出
export const exportCustomers = (params) => {
  return get('/customers/export', params, { responseType: 'blob' });
};

// 客户导入
export const importCustomers = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return post('/customers/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// 获取跟进记录列表
export const getFollowUpList = (params) => {
  return get('/follow-ups', params);
};

// 添加跟进记录
export const createFollowUp = (data) => {
  return post('/follow-ups', data);
};

// 更新跟进记录
export const updateFollowUp = (id, data) => {
  return put(`/follow-ups/${id}`, data);
};

// 删除跟进记录
export const deleteFollowUp = (id) => {
  return del(`/follow-ups/${id}`);
};

// 获取客户统计
export const getCustomerStats = () => {
  return get('/customers/stats');
};
