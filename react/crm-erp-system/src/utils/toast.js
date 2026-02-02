/**
 * Toast消息提示工具
 * 提供全局消息提示功能
 */

// 消息类型
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// 消息队列
let toastQueue = [];
let toastContainer = null;

// 默认配置
const defaultOptions = {
  duration: 3000,
  position: 'top-right',
  closable: true,
};

/**
 * 获取或创建Toast容器
 */
const getContainer = () => {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
};

/**
 * 创建Toast元素
 */
const createToastElement = (message, type, options) => {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  // 图标
  const icons = {
    success: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
    </svg>`,
    error: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
    </svg>`,
    warning: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
    </svg>`,
    info: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
    </svg>`,
  };
  
  toast.innerHTML = `
    <span class="toast-icon">${icons[type]}</span>
    <span class="toast-message">${message}</span>
    ${options.closable ? '<button class="toast-close">&times;</button>' : ''}
  `;
  
  // 关闭按钮事件
  if (options.closable) {
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => removeToast(toast));
  }
  
  return toast;
};

/**
 * 移除Toast
 */
const removeToast = (toast) => {
  toast.classList.add('toast-exit');
  setTimeout(() => {
    toast.remove();
    toastQueue = toastQueue.filter(t => t !== toast);
  }, 200);
};

/**
 * 显示Toast
 */
const showToast = (message, type, options = {}) => {
  const mergedOptions = { ...defaultOptions, ...options };
  const container = getContainer();
  const toast = createToastElement(message, type, mergedOptions);
  
  container.appendChild(toast);
  toastQueue.push(toast);
  
  // 自动关闭
  if (mergedOptions.duration > 0) {
    setTimeout(() => {
      if (document.body.contains(toast)) {
        removeToast(toast);
      }
    }, mergedOptions.duration);
  }
  
  return toast;
};

/**
 * Toast API
 */
export const toast = {
  success: (message, options) => showToast(message, TOAST_TYPES.SUCCESS, options),
  error: (message, options) => showToast(message, TOAST_TYPES.ERROR, options),
  warning: (message, options) => showToast(message, TOAST_TYPES.WARNING, options),
  info: (message, options) => showToast(message, TOAST_TYPES.INFO, options),
  
  /**
   * 清除所有Toast
   */
  clear: () => {
    toastQueue.forEach(toast => removeToast(toast));
  },
};

export default toast;
