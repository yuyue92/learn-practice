/**
 * 消息提示组件
 */

import { useState, useEffect } from 'react';

let toastId = 0;
const toastListeners = new Set();

// Toast 管理器
export const toast = {
  success: (message, duration = 3000) => {
    showToast({ type: 'success', message, duration });
  },
  error: (message, duration = 3000) => {
    showToast({ type: 'error', message, duration });
  },
  warning: (message, duration = 3000) => {
    showToast({ type: 'warning', message, duration });
  },
  info: (message, duration = 3000) => {
    showToast({ type: 'info', message, duration });
  },
};

function showToast(config) {
  const id = toastId++;
  const toast = { id, ...config };
  
  toastListeners.forEach((listener) => {
    listener({ type: 'add', toast });
  });

  if (config.duration > 0) {
    setTimeout(() => {
      toastListeners.forEach((listener) => {
        listener({ type: 'remove', id });
      });
    }, config.duration);
  }
}

// Toast 容器组件
function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const listener = (event) => {
      if (event.type === 'add') {
        setToasts((prev) => [...prev, event.toast]);
      } else if (event.type === 'remove') {
        setToasts((prev) => prev.filter((t) => t.id !== event.id));
      }
    };

    toastListeners.add(listener);
    return () => toastListeners.delete(listener);
  }, []);

  return (
    <div className="fixed top-4 right-4 z-tooltip space-y-2 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} {...toast} />
      ))}
    </div>
  );
}

// 单个 Toast 项
function ToastItem({ type, message }) {
  const icons = {
    success: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  const colors = {
    success: 'bg-success-50 dark:bg-success-900/20 text-success-800 dark:text-success-400 border-success-200 dark:border-success-800',
    error: 'bg-danger-50 dark:bg-danger-900/20 text-danger-800 dark:text-danger-400 border-danger-200 dark:border-danger-800',
    warning: 'bg-warning-50 dark:bg-warning-900/20 text-warning-800 dark:text-warning-400 border-warning-200 dark:border-warning-800',
    info: 'bg-primary-50 dark:bg-primary-900/20 text-primary-800 dark:text-primary-400 border-primary-200 dark:border-primary-800',
  };

  return (
    <div className={`pointer-events-auto flex items-center space-x-3 px-4 py-3 rounded-lg border shadow-lg animate-slide-in-right ${colors[type]}`}>
      <div className="flex-shrink-0">{icons[type]}</div>
      <div className="flex-1 text-sm font-medium">{message}</div>
    </div>
  );
}

// 导出 Toast 容器和工具函数
export default ToastContainer;
