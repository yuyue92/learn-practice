/**
 * HTTP 请求封装
 * 基于 Axios 实现统一的请求/响应拦截
 */

import axios from 'axios';
import Cookies from 'js-cookie';
import { HTTP_STATUS } from '@/config/constants';
import { mockApi } from './mockData';

const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY || 'crm_erp_token';
const ENABLE_MOCK = import.meta.env.VITE_ENABLE_MOCK === 'true';

// Mock 路由映射
const mockRoutes = {
  'GET /customers': (params) => mockApi.getCustomers(params),
  'GET /customers/:id': (id) => mockApi.getCustomerDetail(id),
  'POST /customers': (data) => mockApi.createCustomer(data),
  'PUT /customers/:id': (id, data) => mockApi.updateCustomer(id, data),
  'DELETE /customers/:id': (id) => mockApi.deleteCustomer(id),
  'GET /follow-ups': (params) => mockApi.getFollowUps(params),
  'POST /follow-ups': (data) => mockApi.createFollowUp(data),
};

// 匹配 Mock 路由
function matchMockRoute(method, url) {
  const path = url.split('?')[0];
  
  // 精确匹配
  const exactKey = `${method.toUpperCase()} ${path}`;
  if (mockRoutes[exactKey]) {
    return mockRoutes[exactKey];
  }
  
  // 参数匹配 (如 /customers/123 匹配 /customers/:id)
  for (const [pattern, handler] of Object.entries(mockRoutes)) {
    const [mockMethod, mockPath] = pattern.split(' ');
    if (mockMethod === method.toUpperCase()) {
      const regex = new RegExp('^' + mockPath.replace(/:[\w]+/g, '([^/]+)') + '$');
      const match = path.match(regex);
      if (match) {
        return (...args) => handler(match[1], ...args);
      }
    }
  }
  
  return null;
}

// 创建 axios 实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
request.interceptors.request.use(
  async (config) => {
    // Mock 数据拦截
    if (ENABLE_MOCK) {
      const mockHandler = matchMockRoute(config.method, config.url);
      if (mockHandler) {
        // 模拟请求延迟
        const result = await mockHandler(config.params || config.data);
        // 抛出特殊对象,在响应拦截器中处理
        throw { __mock: true, data: result };
      }
    }

    // 添加 Token
    const token = Cookies.get(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 添加请求时间戳 (防止缓存)
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }

    // 添加请求ID (用于日志追踪)
    config.headers['X-Request-ID'] = generateRequestId();

    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const { data, config } = response;

    // 如果响应数据有特定格式,这里进行统一处理
    // 假设后端返回格式: { code: 200, data: {...}, message: 'success' }
    
    if (data.code === HTTP_STATUS.OK || response.status === HTTP_STATUS.OK) {
      return data.data || data;
    }

    // 业务错误处理
    return Promise.reject(new Error(data.message || '请求失败'));
  },
  (error) => {
    // 处理 Mock 数据
    if (error.__mock) {
      return Promise.resolve(error.data);
    }

    // 错误统一处理
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case HTTP_STATUS.UNAUTHORIZED:
          // 未登录或 Token 过期
          handleUnauthorized();
          break;

        case HTTP_STATUS.FORBIDDEN:
          // 无权限
          showError('无权限访问该资源');
          break;

        case HTTP_STATUS.NOT_FOUND:
          // 资源不存在
          showError('请求的资源不存在');
          break;

        case HTTP_STATUS.INTERNAL_SERVER_ERROR:
          // 服务器错误
          showError('服务器错误,请稍后重试');
          break;

        default:
          showError(data?.message || '请求失败');
      }
    } else if (error.request) {
      // 请求已发送但没有收到响应
      showError('网络错误,请检查网络连接');
    } else {
      // 请求配置错误
      showError(error.message || '请求配置错误');
    }

    return Promise.reject(error);
  }
);

// 生成请求ID
function generateRequestId() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// 处理未授权
function handleUnauthorized() {
  // 清除登录信息
  Cookies.remove(TOKEN_KEY);
  localStorage.clear();
  
  // 跳转登录页
  window.location.href = '/login';
  
  showError('登录已过期,请重新登录');
}

// 显示错误提示
function showError(message) {
  // 这里可以集成消息提示组件
  console.error(message);
  
  // 如果有全局的消息提示函数,可以在这里调用
  if (window.__showToast) {
    window.__showToast({
      type: 'error',
      message,
    });
  }
}

// 封装常用请求方法
export const get = (url, params, config) => {
  return request.get(url, { params, ...config });
};

export const post = (url, data, config) => {
  return request.post(url, data, config);
};

export const put = (url, data, config) => {
  return request.put(url, data, config);
};

export const del = (url, config) => {
  return request.delete(url, config);
};

export const patch = (url, data, config) => {
  return request.patch(url, data, config);
};

export default request;
