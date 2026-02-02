/**
 * 弹窗组件
 * 企业级通用弹窗
 */
import { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import { HiOutlineX, HiOutlineExclamation, HiOutlineCheck, HiOutlineInformationCircle } from 'react-icons/hi';
import Button from './Button';

/**
 * 弹窗尺寸映射
 */
const sizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-full mx-4',
};

/**
 * 弹窗组件
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closable = true,
  maskClosable = true,
  keyboard = true,
  centered = true,
  className,
  headerClassName,
  bodyClassName,
  footerClassName,
}) => {
  // 键盘事件处理
  useEffect(() => {
    if (!isOpen || !keyboard) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && closable) {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, keyboard, closable, onClose]);

  // 禁止背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleMaskClick = useCallback(() => {
    if (maskClosable && closable) {
      onClose?.();
    }
  }, [maskClosable, closable, onClose]);

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-modal flex items-center justify-center">
      {/* 遮罩层 */}
      <div
        className="absolute inset-0 bg-black/50 animate-fade-in"
        onClick={handleMaskClick}
      />

      {/* 弹窗内容 */}
      <div
        className={clsx(
          'relative w-full bg-white rounded-xl shadow-modal',
          'dark:bg-neutral-800',
          'animate-scale-in',
          sizeStyles[size],
          centered ? 'my-auto' : 'mt-24 mb-auto',
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        {(title || closable) && (
          <div
            className={clsx(
              'flex items-center justify-between px-6 py-4',
              'border-b border-neutral-200 dark:border-neutral-700',
              headerClassName
            )}
          >
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              {title}
            </h3>
            {closable && (
              <button
                type="button"
                className={clsx(
                  'p-1 rounded-lg text-neutral-400',
                  'hover:bg-neutral-100 hover:text-neutral-600',
                  'dark:hover:bg-neutral-700 dark:hover:text-neutral-300',
                  'transition-colors duration-150'
                )}
                onClick={onClose}
              >
                <HiOutlineX className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* 内容 */}
        <div
          className={clsx(
            'px-6 py-4 overflow-y-auto',
            'max-h-[60vh]',
            bodyClassName
          )}
        >
          {children}
        </div>

        {/* 底部 */}
        {footer !== undefined && (
          <div
            className={clsx(
              'flex items-center justify-end gap-3 px-6 py-4',
              'border-t border-neutral-200 dark:border-neutral-700',
              footerClassName
            )}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

/**
 * 确认弹窗组件
 */
export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = '确认',
  content = '确定要执行此操作吗？',
  confirmText = '确定',
  cancelText = '取消',
  type = 'warning', // info | warning | danger | success
  loading = false,
}) => {
  const iconMap = {
    info: <HiOutlineInformationCircle className="w-12 h-12 text-primary-500" />,
    warning: <HiOutlineExclamation className="w-12 h-12 text-warning-500" />,
    danger: <HiOutlineExclamation className="w-12 h-12 text-danger-500" />,
    success: <HiOutlineCheck className="w-12 h-12 text-success-500" />,
  };

  const confirmButtonVariant = {
    info: 'primary',
    warning: 'warning',
    danger: 'danger',
    success: 'success',
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      closable={false}
    >
      <div className="text-center">
        <div className="flex justify-center mb-4">
          {iconMap[type]}
        </div>
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
          {title}
        </h3>
        <p className="text-neutral-500 dark:text-neutral-400 mb-6">
          {content}
        </p>
        <div className="flex justify-center gap-3">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            variant={confirmButtonVariant[type]}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

/**
 * 抽屉组件
 */
export const Drawer = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  placement = 'right', // left | right | top | bottom
  size = 'md',
  closable = true,
  maskClosable = true,
  className,
}) => {
  // 键盘事件处理
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && closable) {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closable, onClose]);

  // 禁止背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const placementStyles = {
    left: 'left-0 top-0 bottom-0 animate-slide-right',
    right: 'right-0 top-0 bottom-0 animate-slide-left',
    top: 'top-0 left-0 right-0 animate-slide-down',
    bottom: 'bottom-0 left-0 right-0 animate-slide-up',
  };

  const sizeMap = {
    sm: placement === 'left' || placement === 'right' ? 'w-80' : 'h-60',
    md: placement === 'left' || placement === 'right' ? 'w-96' : 'h-80',
    lg: placement === 'left' || placement === 'right' ? 'w-[480px]' : 'h-96',
    xl: placement === 'left' || placement === 'right' ? 'w-[600px]' : 'h-[480px]',
  };

  const drawerContent = (
    <div className="fixed inset-0 z-modal">
      {/* 遮罩层 */}
      <div
        className="absolute inset-0 bg-black/50 animate-fade-in"
        onClick={() => maskClosable && closable && onClose?.()}
      />

      {/* 抽屉内容 */}
      <div
        className={clsx(
          'absolute bg-white shadow-modal flex flex-col',
          'dark:bg-neutral-800',
          placementStyles[placement],
          sizeMap[size],
          className
        )}
      >
        {/* 头部 */}
        {(title || closable) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              {title}
            </h3>
            {closable && (
              <button
                type="button"
                className="p-1 rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
                onClick={onClose}
              >
                <HiOutlineX className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* 内容 */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {children}
        </div>

        {/* 底部 */}
        {footer && (
          <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-700">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(drawerContent, document.body);
};

export default Modal;
