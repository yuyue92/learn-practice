/**
 * 通用弹窗组件
 */

import { useEffect } from 'react';

function Modal({
  visible = false,
  title = '提示',
  children,
  onClose,
  onOk,
  onCancel,
  okText = '确定',
  cancelText = '取消',
  width = 'max-w-2xl',
  footer = true,
  loading = false,
}) {
  // ESC 键关闭
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && visible) {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [visible, onClose]);

  // 防止背景滚动
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-modal flex items-center justify-center">
      {/* 遮罩层 */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* 弹窗内容 */}
      <div className={`relative ${width} w-full mx-4 animate-scale-in`}>
        <div className="card p-0 max-h-[90vh] flex flex-col">
          {/* 标题栏 */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 内容区 */}
          <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
            {children}
          </div>

          {/* 底部按钮 */}
          {footer && (
            <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-neutral-200 dark:border-neutral-700">
              <button
                onClick={onCancel || onClose}
                disabled={loading}
                className="btn btn-secondary disabled:opacity-50"
              >
                {cancelText}
              </button>
              <button
                onClick={onOk}
                disabled={loading}
                className="btn btn-primary disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>处理中...</span>
                  </span>
                ) : (
                  okText
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Modal;
