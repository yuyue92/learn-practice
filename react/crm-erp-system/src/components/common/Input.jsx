/**
 * 输入框组件
 * 企业级通用输入框，支持多种类型和状态
 */
import { forwardRef, useState } from 'react';
import clsx from 'clsx';
import { HiOutlineEye, HiOutlineEyeOff, HiOutlineSearch, HiOutlineX } from 'react-icons/hi';

/**
 * 输入框尺寸样式映射
 */
const sizeStyles = {
  sm: 'px-2.5 py-1.5 text-xs',
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-3 text-base',
};

/**
 * 基础输入框组件
 */
const Input = forwardRef(({
  type = 'text',
  size = 'md',
  error = false,
  disabled = false,
  readOnly = false,
  prefix = null,
  suffix = null,
  clearable = false,
  onClear,
  className,
  containerClassName,
  value,
  onChange,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const handleClear = () => {
    onChange?.({ target: { value: '' } });
    onClear?.();
  };

  const containerClasses = clsx(
    'relative inline-flex items-center w-full',
    'bg-white border rounded-md transition-colors duration-200',
    'dark:bg-neutral-800',
    // 边框颜色
    error
      ? 'border-danger-500 focus-within:border-danger-500 focus-within:ring-2 focus-within:ring-danger-500/20'
      : 'border-neutral-300 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20 dark:border-neutral-600 dark:focus-within:border-primary-400',
    // 禁用状态
    disabled && 'bg-neutral-100 cursor-not-allowed dark:bg-neutral-700',
    containerClassName
  );

  const inputClasses = clsx(
    'flex-1 bg-transparent border-none outline-none',
    'placeholder:text-neutral-400 dark:placeholder:text-neutral-500',
    'text-neutral-900 dark:text-neutral-100',
    'disabled:cursor-not-allowed',
    sizeStyles[size],
    // 如果有前缀，去掉左padding
    prefix && 'pl-0',
    // 如果有后缀或清除按钮或密码切换，去掉右padding
    (suffix || clearable || isPassword) && 'pr-0',
    className
  );

  const iconClasses = 'text-neutral-400 dark:text-neutral-500';

  return (
    <div className={containerClasses}>
      {prefix && (
        <span className={clsx('pl-3 flex items-center', iconClasses)}>
          {prefix}
        </span>
      )}
      
      <input
        ref={ref}
        type={inputType}
        className={inputClasses}
        disabled={disabled}
        readOnly={readOnly}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />

      {/* 清除按钮 */}
      {clearable && value && !disabled && !readOnly && (
        <button
          type="button"
          className={clsx(
            'pr-3 flex items-center cursor-pointer',
            'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
          )}
          onClick={handleClear}
          tabIndex={-1}
        >
          <HiOutlineX className="w-4 h-4" />
        </button>
      )}

      {/* 密码显示切换 */}
      {isPassword && (
        <button
          type="button"
          className={clsx(
            'pr-3 flex items-center cursor-pointer',
            'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
          )}
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1}
        >
          {showPassword ? (
            <HiOutlineEyeOff className="w-4 h-4" />
          ) : (
            <HiOutlineEye className="w-4 h-4" />
          )}
        </button>
      )}

      {suffix && (
        <span className={clsx('pr-3 flex items-center', iconClasses)}>
          {suffix}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

/**
 * 搜索输入框组件
 */
export const SearchInput = forwardRef(({
  placeholder = '搜索...',
  onSearch,
  className,
  ...props
}, ref) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch?.(e.target.value);
    }
  };

  return (
    <Input
      ref={ref}
      type="text"
      placeholder={placeholder}
      prefix={<HiOutlineSearch className="w-4 h-4" />}
      clearable
      onKeyDown={handleKeyDown}
      className={className}
      {...props}
    />
  );
});

SearchInput.displayName = 'SearchInput';

/**
 * 文本域组件
 */
export const Textarea = forwardRef(({
  rows = 4,
  size = 'md',
  error = false,
  disabled = false,
  readOnly = false,
  resize = 'vertical', // none | vertical | horizontal | both
  className,
  ...props
}, ref) => {
  const textareaClasses = clsx(
    'w-full bg-white border rounded-md outline-none transition-colors duration-200',
    'placeholder:text-neutral-400 dark:placeholder:text-neutral-500',
    'text-neutral-900 dark:text-neutral-100',
    'dark:bg-neutral-800',
    // 边框颜色
    error
      ? 'border-danger-500 focus:border-danger-500 focus:ring-2 focus:ring-danger-500/20'
      : 'border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-600 dark:focus:border-primary-400',
    // 禁用状态
    disabled && 'bg-neutral-100 cursor-not-allowed dark:bg-neutral-700',
    // 尺寸
    sizeStyles[size],
    // 调整大小
    resize === 'none' && 'resize-none',
    resize === 'vertical' && 'resize-y',
    resize === 'horizontal' && 'resize-x',
    resize === 'both' && 'resize',
    className
  );

  return (
    <textarea
      ref={ref}
      rows={rows}
      className={textareaClasses}
      disabled={disabled}
      readOnly={readOnly}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';

/**
 * 表单项组件
 */
export const FormItem = ({
  label,
  required = false,
  error,
  hint,
  children,
  className,
}) => {
  return (
    <div className={clsx('mb-4', className)}>
      {label && (
        <label className={clsx(
          'block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1',
          required && "after:content-['*'] after:text-danger-500 after:ml-1"
        )}>
          {label}
        </label>
      )}
      {children}
      {error && (
        <p className="text-xs text-danger-500 mt-1">{error}</p>
      )}
      {hint && !error && (
        <p className="text-xs text-neutral-500 mt-1">{hint}</p>
      )}
    </div>
  );
};

export default Input;
