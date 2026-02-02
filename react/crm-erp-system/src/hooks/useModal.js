/**
 * 弹窗Hook
 * 提供弹窗状态管理
 */
import { useState, useCallback } from 'react';

/**
 * 弹窗Hook
 * @param {boolean} defaultOpen - 默认是否打开
 * @returns {Object} 弹窗相关状态和方法
 */
export const useModal = (defaultOpen = false) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [data, setData] = useState(null);

  /**
   * 打开弹窗
   * @param {any} modalData - 弹窗数据
   */
  const open = useCallback((modalData = null) => {
    setData(modalData);
    setIsOpen(true);
  }, []);

  /**
   * 关闭弹窗
   */
  const close = useCallback(() => {
    setIsOpen(false);
    // 延迟清除数据，避免关闭动画时数据突然消失
    setTimeout(() => setData(null), 200);
  }, []);

  /**
   * 切换弹窗状态
   */
  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  /**
   * 设置弹窗数据
   * @param {any} newData - 新数据
   */
  const setModalData = useCallback((newData) => {
    setData(newData);
  }, []);

  return {
    isOpen,
    data,
    open,
    close,
    toggle,
    setData: setModalData,
  };
};

/**
 * 确认弹窗Hook
 * @returns {Object} 确认弹窗相关状态和方法
 */
export const useConfirm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState({
    title: '确认',
    content: '确定要执行此操作吗？',
    confirmText: '确定',
    cancelText: '取消',
    type: 'warning', // info | warning | danger
    onConfirm: null,
    onCancel: null,
  });

  /**
   * 打开确认弹窗
   * @param {Object} options - 配置项
   * @returns {Promise<boolean>}
   */
  const confirm = useCallback((options = {}) => {
    return new Promise((resolve) => {
      setConfig({
        ...config,
        ...options,
        onConfirm: () => {
          setIsOpen(false);
          options.onConfirm?.();
          resolve(true);
        },
        onCancel: () => {
          setIsOpen(false);
          options.onCancel?.();
          resolve(false);
        },
      });
      setIsOpen(true);
    });
  }, [config]);

  /**
   * 关闭确认弹窗
   */
  const close = useCallback(() => {
    setIsOpen(false);
    config.onCancel?.();
  }, [config]);

  return {
    isOpen,
    config,
    confirm,
    close,
  };
};

/**
 * 删除确认弹窗Hook
 * @param {Function} onDelete - 删除回调
 * @returns {Object} 删除确认相关状态和方法
 */
export const useDeleteConfirm = (onDelete) => {
  const { isOpen, config, confirm, close } = useConfirm();
  const [deleting, setDeleting] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  /**
   * 确认删除
   * @param {any} item - 要删除的项
   * @param {Object} options - 配置项
   */
  const confirmDelete = useCallback(async (item, options = {}) => {
    setItemToDelete(item);
    
    const confirmed = await confirm({
      title: options.title || '确认删除',
      content: options.content || '删除后数据将无法恢复，确定要删除吗？',
      confirmText: options.confirmText || '删除',
      cancelText: options.cancelText || '取消',
      type: 'danger',
    });

    if (confirmed) {
      try {
        setDeleting(true);
        await onDelete(item);
      } finally {
        setDeleting(false);
        setItemToDelete(null);
      }
    } else {
      setItemToDelete(null);
    }
  }, [confirm, onDelete]);

  return {
    isOpen,
    config,
    deleting,
    itemToDelete,
    confirmDelete,
    close,
  };
};

export default useModal;
