import axios from 'axios';
import { useAuthStore } from '../stores/authStore.js';

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000
});

http.interceptors.request.use((config) => {
  const token = useAuthStore.getState().tokenObj?.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err?.response?.data?.message || err.message || '请求失败';
    return Promise.reject(new Error(msg));
  }
);
