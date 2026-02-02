/**
 * HTTP请求工具
 * 基于axios封装，支持请求/响应拦截、令牌携带、错误处理
 */
import axios from 'axios';
import { config } from '@/config';
import { getToken, removeToken } from '@/utils/auth';
import { toast } from '@/utils/toast';

// 创建axios实例
const request = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
request.interceptors.request.use(
  (requestConfig) => {
    // 携带令牌
    const token = getToken();
    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }
    
    // 添加时间戳防止缓存（GET请求）
    if (requestConfig.method?.toLowerCase() === 'get') {
      requestConfig.params = {
        ...requestConfig.params,
        _t: Date.now(),
      };
    }
    
    return requestConfig;
  },
  (error) => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const { data } = response;
    
    // 根据业务码判断请求是否成功
    // 假设后端返回格式：{ code: 0, data: {}, message: '' }
    if (data.code === 0 || data.code === 200 || data.success) {
      return data.data !== undefined ? data.data : data;
    }
    
    // 业务错误
    const errorMsg = data.message || '请求失败';
    toast.error(errorMsg);
    return Promise.reject(new Error(errorMsg));
  },
  (error) => {
    // 网络错误或HTTP错误
    let message = '网络错误，请检查网络连接';
    
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          message = data?.message || '请求参数错误';
          break;
        case 401:
          message = '登录已过期，请重新登录';
          // 清除令牌并跳转登录页
          removeToken();
          window.location.href = '/login';
          break;
        case 403:
          message = '没有权限访问该资源';
          break;
        case 404:
          message = '请求的资源不存在';
          break;
        case 500:
          message = data?.message || '服务器内部错误';
          break;
        case 502:
          message = '网关错误';
          break;
        case 503:
          message = '服务暂时不可用';
          break;
        case 504:
          message = '网关超时';
          break;
        default:
          message = data?.message || `请求失败(${status})`;
      }
    } else if (error.code === 'ECONNABORTED') {
      message = '请求超时，请稍后重试';
    } else if (error.message?.includes('Network Error')) {
      message = '网络连接失败，请检查网络';
    }
    
    toast.error(message);
    return Promise.reject(error);
  }
);

/**
 * GET请求
 * @param {string} url - 请求地址
 * @param {object} params - 查询参数
 * @param {object} options - 其他配置
 * @returns {Promise}
 */
export const get = (url, params = {}, options = {}) => {
  return request.get(url, { params, ...options });
};

/**
 * POST请求
 * @param {string} url - 请求地址
 * @param {object} data - 请求数据
 * @param {object} options - 其他配置
 * @returns {Promise}
 */
export const post = (url, data = {}, options = {}) => {
  return request.post(url, data, options);
};

/**
 * PUT请求
 * @param {string} url - 请求地址
 * @param {object} data - 请求数据
 * @param {object} options - 其他配置
 * @returns {Promise}
 */
export const put = (url, data = {}, options = {}) => {
  return request.put(url, data, options);
};

/**
 * DELETE请求
 * @param {string} url - 请求地址
 * @param {object} params - 查询参数
 * @param {object} options - 其他配置
 * @returns {Promise}
 */
export const del = (url, params = {}, options = {}) => {
  return request.delete(url, { params, ...options });
};

/**
 * PATCH请求
 * @param {string} url - 请求地址
 * @param {object} data - 请求数据
 * @param {object} options - 其他配置
 * @returns {Promise}
 */
export const patch = (url, data = {}, options = {}) => {
  return request.patch(url, data, options);
};

/**
 * 文件上传
 * @param {string} url - 上传地址
 * @param {FormData} formData - 表单数据
 * @param {function} onProgress - 上传进度回调
 * @returns {Promise}
 */
export const upload = (url, formData, onProgress) => {
  return request.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    },
  });
};

/**
 * 文件下载
 * @param {string} url - 下载地址
 * @param {object} params - 查询参数
 * @param {string} filename - 文件名
 * @returns {Promise}
 */
export const download = async (url, params = {}, filename = 'download') => {
  const response = await request.get(url, {
    params,
    responseType: 'blob',
  });
  
  // 创建下载链接
  const blob = new Blob([response]);
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(link.href);
  
  return response;
};

export default request;
