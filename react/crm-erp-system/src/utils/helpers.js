/**
 * 通用工具函数
 * 提供常用的工具方法
 */
import { cloneDeep, debounce, throttle, get, set, omit, pick } from 'lodash-es';

// 重新导出lodash常用方法
export { cloneDeep, debounce, throttle, get, set, omit, pick };

/**
 * 生成唯一ID
 * @param {string} prefix - 前缀
 * @returns {string}
 */
export const generateId = (prefix = '') => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return prefix ? `${prefix}_${timestamp}${random}` : `${timestamp}${random}`;
};

/**
 * 延迟执行
 * @param {number} ms - 毫秒数
 * @returns {Promise}
 */
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 格式化金额
 * @param {number} amount - 金额
 * @param {Object} options - 配置项
 * @returns {string}
 */
export const formatMoney = (amount, options = {}) => {
  const {
    prefix = '¥',
    decimals = 2,
    thousandsSep = ',',
    decimalSep = '.',
  } = options;
  
  if (amount === null || amount === undefined || isNaN(amount)) {
    return `${prefix}0.00`;
  }
  
  const num = Number(amount).toFixed(decimals);
  const parts = num.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSep);
  
  return `${prefix}${parts.join(decimalSep)}`;
};

/**
 * 格式化数字（添加千分位）
 * @param {number} num - 数字
 * @returns {string}
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) {
    return '0';
  }
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * 手机号脱敏
 * @param {string} phone - 手机号
 * @returns {string}
 */
export const maskPhone = (phone) => {
  if (!phone || phone.length < 7) return phone || '';
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
};

/**
 * 邮箱脱敏
 * @param {string} email - 邮箱
 * @returns {string}
 */
export const maskEmail = (email) => {
  if (!email || !email.includes('@')) return email || '';
  const [name, domain] = email.split('@');
  const maskedName = name.length > 2 
    ? name.substring(0, 2) + '***' 
    : name + '***';
  return `${maskedName}@${domain}`;
};

/**
 * 身份证号脱敏
 * @param {string} idCard - 身份证号
 * @returns {string}
 */
export const maskIdCard = (idCard) => {
  if (!idCard || idCard.length < 8) return idCard || '';
  return idCard.replace(/(\d{4})\d{10}(\d{4})/, '$1**********$2');
};

/**
 * 银行卡号脱敏
 * @param {string} bankCard - 银行卡号
 * @returns {string}
 */
export const maskBankCard = (bankCard) => {
  if (!bankCard || bankCard.length < 8) return bankCard || '';
  return bankCard.replace(/(\d{4})\d+(\d{4})/, '$1 **** **** $2');
};

/**
 * 判断是否为空值
 * @param {any} value - 值
 * @returns {boolean}
 */
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * 深度比较两个对象是否相等
 * @param {any} obj1 - 对象1
 * @param {any} obj2 - 对象2
 * @returns {boolean}
 */
export const isEqual = (obj1, obj2) => {
  if (obj1 === obj2) return true;
  if (typeof obj1 !== typeof obj2) return false;
  if (typeof obj1 !== 'object' || obj1 === null || obj2 === null) return false;
  
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  return keys1.every(key => isEqual(obj1[key], obj2[key]));
};

/**
 * 将对象转换为查询字符串
 * @param {Object} params - 参数对象
 * @returns {string}
 */
export const toQueryString = (params) => {
  if (!params || typeof params !== 'object') return '';
  
  const pairs = [];
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(v)}`));
      } else {
        pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
      }
    }
  });
  
  return pairs.join('&');
};

/**
 * 解析查询字符串
 * @param {string} queryString - 查询字符串
 * @returns {Object}
 */
export const parseQueryString = (queryString) => {
  if (!queryString) return {};
  
  const query = queryString.startsWith('?') ? queryString.slice(1) : queryString;
  const params = {};
  
  query.split('&').forEach(pair => {
    const [key, value] = pair.split('=').map(decodeURIComponent);
    if (key) {
      if (params[key] !== undefined) {
        params[key] = Array.isArray(params[key]) 
          ? [...params[key], value] 
          : [params[key], value];
      } else {
        params[key] = value;
      }
    }
  });
  
  return params;
};

/**
 * 将树形数据扁平化
 * @param {Array} tree - 树形数据
 * @param {string} childrenKey - 子节点字段名
 * @returns {Array}
 */
export const flattenTree = (tree, childrenKey = 'children') => {
  const result = [];
  
  const traverse = (nodes) => {
    nodes.forEach(node => {
      const { [childrenKey]: children, ...rest } = node;
      result.push(rest);
      if (children && children.length) {
        traverse(children);
      }
    });
  };
  
  traverse(tree);
  return result;
};

/**
 * 将扁平数据转换为树形结构
 * @param {Array} list - 扁平数据
 * @param {Object} options - 配置项
 * @returns {Array}
 */
export const listToTree = (list, options = {}) => {
  const {
    idKey = 'id',
    parentKey = 'parentId',
    childrenKey = 'children',
    rootValue = null,
  } = options;
  
  const map = {};
  const result = [];
  
  // 创建映射
  list.forEach(item => {
    map[item[idKey]] = { ...item, [childrenKey]: [] };
  });
  
  // 构建树
  list.forEach(item => {
    const parent = map[item[parentKey]];
    if (parent) {
      parent[childrenKey].push(map[item[idKey]]);
    } else if (item[parentKey] === rootValue || item[parentKey] === undefined) {
      result.push(map[item[idKey]]);
    }
  });
  
  // 清理空的children数组
  const cleanEmpty = (nodes) => {
    nodes.forEach(node => {
      if (node[childrenKey].length === 0) {
        delete node[childrenKey];
      } else {
        cleanEmpty(node[childrenKey]);
      }
    });
  };
  cleanEmpty(result);
  
  return result;
};

/**
 * 在树中查找节点
 * @param {Array} tree - 树形数据
 * @param {Function} predicate - 判断函数
 * @param {string} childrenKey - 子节点字段名
 * @returns {Object|null}
 */
export const findInTree = (tree, predicate, childrenKey = 'children') => {
  for (const node of tree) {
    if (predicate(node)) {
      return node;
    }
    if (node[childrenKey] && node[childrenKey].length) {
      const found = findInTree(node[childrenKey], predicate, childrenKey);
      if (found) return found;
    }
  }
  return null;
};

/**
 * 复制文本到剪贴板
 * @param {string} text - 文本
 * @returns {Promise<boolean>}
 */
export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    
    // 降级方案
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  } catch {
    return false;
  }
};

/**
 * 下载文件
 * @param {string} url - 文件URL
 * @param {string} filename - 文件名
 */
export const downloadFile = (url, filename) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * 获取文件扩展名
 * @param {string} filename - 文件名
 * @returns {string}
 */
export const getFileExtension = (filename) => {
  if (!filename) return '';
  const lastDot = filename.lastIndexOf('.');
  return lastDot === -1 ? '' : filename.slice(lastDot + 1).toLowerCase();
};

/**
 * 格式化文件大小
 * @param {number} bytes - 字节数
 * @returns {string}
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + units[i];
};

/**
 * 颜色转换：HEX转RGB
 * @param {string} hex - HEX颜色值
 * @returns {{ r: number, g: number, b: number }|null}
 */
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
};

/**
 * 验证手机号
 * @param {string} phone - 手机号
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
  return /^1[3-9]\d{9}$/.test(phone);
};

/**
 * 验证邮箱
 * @param {string} email - 邮箱
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * 验证身份证号
 * @param {string} idCard - 身份证号
 * @returns {boolean}
 */
export const isValidIdCard = (idCard) => {
  return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(idCard);
};

export default {
  generateId,
  sleep,
  formatMoney,
  formatNumber,
  maskPhone,
  maskEmail,
  maskIdCard,
  maskBankCard,
  isEmpty,
  isEqual,
  toQueryString,
  parseQueryString,
  flattenTree,
  listToTree,
  findInTree,
  copyToClipboard,
  downloadFile,
  getFileExtension,
  formatFileSize,
  hexToRgb,
  isValidPhone,
  isValidEmail,
  isValidIdCard,
  cloneDeep,
  debounce,
  throttle,
  get,
  set,
  omit,
  pick,
};
