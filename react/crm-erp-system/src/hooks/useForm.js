/**
 * 表单Hook
 * 提供表单草稿缓存、表单状态管理等功能
 */
import { useState, useCallback, useEffect, useRef } from 'react';
import { config } from '@/config';
import { debounce } from '@/utils/helpers';

/**
 * 表单草稿Hook
 * @param {string} formKey - 表单唯一标识
 * @param {Object} defaultValues - 默认值
 * @param {Object} options - 配置项
 * @returns {Object} 表单草稿相关状态和方法
 */
export const useFormDraft = (formKey, defaultValues = {}, options = {}) => {
  const {
    autoSaveDelay = 1000,
    enableAutoSave = true,
  } = options;

  const storageKey = `${config.storage.formDraftPrefix}${formKey}`;
  const [hasDraft, setHasDraft] = useState(false);
  const [draftData, setDraftData] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);

  /**
   * 加载草稿
   */
  const loadDraft = useCallback(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const data = JSON.parse(saved);
        setDraftData(data.values);
        setLastSaved(data.savedAt);
        setHasDraft(true);
        return data.values;
      }
    } catch (e) {
      console.error('Failed to load draft:', e);
    }
    return null;
  }, [storageKey]);

  /**
   * 保存草稿
   * @param {Object} values - 表单数据
   */
  const saveDraft = useCallback((values) => {
    try {
      const data = {
        values,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(storageKey, JSON.stringify(data));
      setDraftData(values);
      setLastSaved(data.savedAt);
      setHasDraft(true);
    } catch (e) {
      console.error('Failed to save draft:', e);
    }
  }, [storageKey]);

  /**
   * 防抖保存草稿
   */
  const debouncedSaveDraft = useCallback(
    debounce((values) => saveDraft(values), autoSaveDelay),
    [saveDraft, autoSaveDelay]
  );

  /**
   * 清除草稿
   */
  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
      setDraftData(null);
      setLastSaved(null);
      setHasDraft(false);
    } catch (e) {
      console.error('Failed to clear draft:', e);
    }
  }, [storageKey]);

  /**
   * 恢复草稿
   * @returns {Object|null} 草稿数据
   */
  const restoreDraft = useCallback(() => {
    return draftData;
  }, [draftData]);

  // 初始化时加载草稿
  useEffect(() => {
    loadDraft();
  }, [loadDraft]);

  return {
    hasDraft,
    draftData,
    lastSaved,
    loadDraft,
    saveDraft: enableAutoSave ? debouncedSaveDraft : saveDraft,
    clearDraft,
    restoreDraft,
  };
};

/**
 * 表单提交Hook
 * @param {Function} submitFn - 提交函数
 * @param {Object} options - 配置项
 * @returns {Object} 表单提交相关状态和方法
 */
export const useFormSubmit = (submitFn, options = {}) => {
  const {
    onSuccess,
    onError,
    resetOnSuccess = false,
  } = options;

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const abortControllerRef = useRef(null);

  /**
   * 提交表单
   * @param {Object} data - 表单数据
   * @param {Object} extra - 额外参数
   */
  const submit = useCallback(async (data, extra = {}) => {
    // 取消之前的请求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const result = await submitFn(data, {
        ...extra,
        signal: abortControllerRef.current.signal,
      });
      
      setSubmitSuccess(true);
      onSuccess?.(result, data);
      return result;
    } catch (error) {
      if (error.name !== 'AbortError') {
        setSubmitError(error.message || '提交失败');
        onError?.(error, data);
        throw error;
      }
    } finally {
      setSubmitting(false);
    }
  }, [submitFn, onSuccess, onError]);

  /**
   * 重置状态
   */
  const reset = useCallback(() => {
    setSubmitting(false);
    setSubmitError(null);
    setSubmitSuccess(false);
  }, []);

  /**
   * 取消请求
   */
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // 组件卸载时取消请求
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    submitting,
    submitError,
    submitSuccess,
    submit,
    reset,
    cancel,
  };
};

/**
 * 表单验证Hook
 * @param {Object} schema - Zod验证schema
 * @returns {Object} 表单验证相关方法
 */
export const useFormValidation = (schema) => {
  const [errors, setErrors] = useState({});

  /**
   * 验证单个字段
   * @param {string} field - 字段名
   * @param {any} value - 字段值
   * @returns {string|null} 错误信息
   */
  const validateField = useCallback((field, value) => {
    try {
      const fieldSchema = schema.shape?.[field];
      if (fieldSchema) {
        fieldSchema.parse(value);
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
        return null;
      }
    } catch (error) {
      const message = error.errors?.[0]?.message || '验证失败';
      setErrors(prev => ({ ...prev, [field]: message }));
      return message;
    }
    return null;
  }, [schema]);

  /**
   * 验证所有字段
   * @param {Object} values - 表单数据
   * @returns {{ valid: boolean, errors: Object }}
   */
  const validateAll = useCallback((values) => {
    try {
      schema.parse(values);
      setErrors({});
      return { valid: true, errors: {} };
    } catch (error) {
      const fieldErrors = {};
      error.errors?.forEach(err => {
        const field = err.path.join('.');
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return { valid: false, errors: fieldErrors };
    }
  }, [schema]);

  /**
   * 清除错误
   * @param {string} field - 字段名（可选，不传则清除所有）
   */
  const clearErrors = useCallback((field) => {
    if (field) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    } else {
      setErrors({});
    }
  }, []);

  /**
   * 设置错误
   * @param {Object} newErrors - 错误对象
   */
  const setFieldErrors = useCallback((newErrors) => {
    setErrors(prev => ({ ...prev, ...newErrors }));
  }, []);

  /**
   * 获取字段错误
   * @param {string} field - 字段名
   * @returns {string|undefined}
   */
  const getFieldError = useCallback((field) => {
    return errors[field];
  }, [errors]);

  /**
   * 检查是否有错误
   * @returns {boolean}
   */
  const hasErrors = useCallback(() => {
    return Object.keys(errors).length > 0;
  }, [errors]);

  return {
    errors,
    validateField,
    validateAll,
    clearErrors,
    setFieldErrors,
    getFieldError,
    hasErrors,
  };
};

export default {
  useFormDraft,
  useFormSubmit,
  useFormValidation,
};
