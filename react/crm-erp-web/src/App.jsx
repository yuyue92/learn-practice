/**
 * 应用根组件
 * 负责:
 * 1. 路由配置
 * 2. 全局错误边界
 * 3. 主题管理
 */

import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Router from './router';
import { useThemeStore } from './stores/useThemeStore';
import ErrorBoundary from './components/common/ErrorBoundary';
import ToastContainer from './components/common/Toast';

function App() {
  const { theme, initTheme } = useThemeStore();

  // 初始化主题
  useEffect(() => {
    initTheme();
  }, [initTheme]);

  // 应用主题class到html根元素
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.add('light');
    }
  }, [theme]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
      <ToastContainer />
    </ErrorBoundary>
  );
}

export default App;
