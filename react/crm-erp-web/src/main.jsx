/**
 * 应用入口文件
 * 负责:
 * 1. 引入全局样式
 * 2. 配置 React Query
 * 3. 挂载 React 应用到 DOM
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './styles/index.css';

// 创建 React Query 客户端
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 数据缓存时间 (5分钟)
      staleTime: 5 * 60 * 1000,
      // 缓存数据时间 (10分钟)
      cacheTime: 10 * 60 * 1000,
      // 失败后重试次数
      retry: 1,
      // 重试延迟
      retryDelay: 1000,
      // 窗口重新获得焦点时重新请求
      refetchOnWindowFocus: false,
      // 网络重新连接时重新请求
      refetchOnReconnect: true,
    },
    mutations: {
      // 失败后重试次数
      retry: 0,
    },
  },
});

// 挂载应用
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
