/**
 * 应用入口文件
 * 挂载React应用到DOM
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// 初始化主题
const initializeTheme = () => {
  const savedTheme = localStorage.getItem('crm_erp_settings');
  if (savedTheme) {
    try {
      const { state } = JSON.parse(savedTheme);
      if (state?.mode === 'dark') {
        document.documentElement.classList.add('dark');
      }
    } catch (e) {
      // 忽略解析错误
    }
  }
};

initializeTheme();

// 渲染应用
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
