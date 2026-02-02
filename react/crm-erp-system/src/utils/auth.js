/**
 * 认证工具
 * 处理令牌存储、加密、过期检测
 */
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import { config } from '@/config';

const { tokenKey, tokenSecretKey, tokenExpireHours } = config.security;

/**
 * 加密数据
 * @param {string} data - 要加密的数据
 * @returns {string}
 */
export const encrypt = (data) => {
  return CryptoJS.AES.encrypt(data, tokenSecretKey).toString();
};

/**
 * 解密数据
 * @param {string} encryptedData - 加密后的数据
 * @returns {string}
 */
export const decrypt = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, tokenSecretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    return '';
  }
};

/**
 * 获取令牌
 * @returns {string|null}
 */
export const getToken = () => {
  const encryptedToken = Cookies.get(tokenKey);
  if (!encryptedToken) return null;
  
  return decrypt(encryptedToken);
};

/**
 * 设置令牌
 * @param {string} token - 令牌
 * @param {boolean} rememberMe - 是否记住登录
 */
export const setToken = (token, rememberMe = false) => {
  const encryptedToken = encrypt(token);
  const options = {
    secure: window.location.protocol === 'https:',
    sameSite: 'Lax',
  };
  
  if (rememberMe) {
    options.expires = tokenExpireHours / 24; // 转换为天数
  }
  
  Cookies.set(tokenKey, encryptedToken, options);
};

/**
 * 移除令牌
 */
export const removeToken = () => {
  Cookies.remove(tokenKey);
};

/**
 * 检查是否已登录
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * 获取用户信息
 * @returns {object|null}
 */
export const getUserInfo = () => {
  try {
    const userStr = localStorage.getItem(config.storage.userKey);
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

/**
 * 设置用户信息
 * @param {object} user - 用户信息
 */
export const setUserInfo = (user) => {
  localStorage.setItem(config.storage.userKey, JSON.stringify(user));
};

/**
 * 移除用户信息
 */
export const removeUserInfo = () => {
  localStorage.removeItem(config.storage.userKey);
};

/**
 * 清除所有认证信息
 */
export const clearAuth = () => {
  removeToken();
  removeUserInfo();
};

/**
 * 密码加密（用于传输）
 * @param {string} password - 原始密码
 * @returns {string}
 */
export const encryptPassword = (password) => {
  return CryptoJS.SHA256(password + tokenSecretKey).toString();
};

export default {
  encrypt,
  decrypt,
  getToken,
  setToken,
  removeToken,
  isAuthenticated,
  getUserInfo,
  setUserInfo,
  removeUserInfo,
  clearAuth,
  encryptPassword,
};
