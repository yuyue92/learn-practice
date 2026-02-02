/**
 * 按钮组件
 * 企业级通用按钮，支持多种样式和状态
 */
import { forwardRef } from 'react';
import clsx from 'clsx';

/**
 * 按钮变体样式映射
 */
const variantStyles = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 active:bg-primary-800',
  secondary: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 focus:ring-neutral-400 border border-neutral-300 dark:bg-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-600 dark:border-neutral-600',
  success: 'bg-success-600 text-white hover:bg-success-700 focus:ring-success-500 active:bg-success-800',
  danger: 'bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-500 active:bg-danger-800',
  warning: 'bg-warning-500 text-white hover:bg-warning-600 focus:ring-warning-400 active:bg-warning-700',
  ghost: 'bg-transparent text-neutral-600 hover:bg-neutral-100 focus:ring-neutral-400 dark:text-neutral-300 dark:hover:bg-neutral-700',
  link: 'bg-transparent text-primary-600 hover:text-primary-700 hover:underline focus:ring-0 p-0 dark:text-primary-400 dark:hover:text-primary-300',
  outline: 'bg-transparent text-primary-600 border border-primary-600 hover:bg-primary-50 focus:ring-primary-500 dark:text-primary-400 dark:border-primary-400 dark:hover:bg-primary-900/20',
};

/**
 * 按钮尺寸样式映射
 */
const sizeStyles = {
  xs: 'px-2 py-1 text-xs',
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-lg',
};

/**
 * 按钮组件
 * @param {Object} props - 组件属性
 * @param {string} props.variant - 按钮变体：primary | secondary | success | danger | warning | ghost | link | outline
 * @param {string} props.size - 按钮尺寸：xs | sm | md | lg | xl
 * @param {boolean} props.loading - 是否加载中
 * @param {boolean} props.disabled - 是否禁用
 * @param {boolean} props.block - 是否块级按钮
 * @param {React.ReactNode} props.icon - 图标
 * @param {string} props.iconPosition - 图标位置：left | right
 * @param {React.ReactNode} props.children - 子元素
 * @param {string} props.className - 自定义类名
 * @param {string} props.type - 按钮类型：button | submit | reset
 */
const Button = forwardRef(({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  block = false,
  icon = null,
  iconPosition = 'left',
  children,
  className,
  type = 'button',
  ...props
}, ref) => {
  const isDisabled = disabled || loading;

  const buttonClasses = clsx(
    // 基础样式
    'inline-flex items-center justify-center font-medium rounded-md',
    'transition-all duration-200 ease-in-out',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-60 disabled:cursor-not-allowed',
    // 暗黑模式焦点环偏移
    'dark:focus:ring-offset-neutral-900',
    // 变体样式
    variantStyles[variant],
    // 尺寸样式（link变体不应用尺寸padding）
    variant !== 'link' && sizeStyles[size],
    // 块级按钮
    block && 'w-full',
    // 自定义类名
    className
  );

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <svg
            className={clsx(
              'animate-spin',
              size === 'xs' ? 'w-3 h-3' : size === 'sm' ? 'w-4 h-4' : 'w-5 h-5',
              children && 'mr-2'
            )}
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {children}
        </>
      );
    }

    if (icon) {
      const iconElement = (
        <span className={clsx(
          size === 'xs' ? 'w-3 h-3' : size === 'sm' ? 'w-4 h-4' : 'w-5 h-5',
          children && (iconPosition === 'left' ? 'mr-2' : 'ml-2')
        )}>
          {icon}
        </span>
      );

      return (
        <>
          {iconPosition === 'left' && iconElement}
          {children}
          {iconPosition === 'right' && iconElement}
        </>
      );
    }

    return children;
  };

  return (
    <button
      ref={ref}
      type={type}
      className={buttonClasses}
      disabled={isDisabled}
      {...props}
    >
      {renderContent()}
    </button>
  );
});

Button.displayName = 'Button';

/**
 * 图标按钮组件
 */
export const IconButton = forwardRef(({
  variant = 'ghost',
  size = 'md',
  children,
  className,
  ...props
}, ref) => {
  const sizeMap = {
    xs: 'p-1',
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
    xl: 'p-4',
  };

  return (
    <Button
      ref={ref}
      variant={variant}
      className={clsx(sizeMap[size], 'rounded-lg', className)}
      {...props}
    >
      {children}
    </Button>
  );
});

IconButton.displayName = 'IconButton';

/**
 * 按钮组组件
 */
export const ButtonGroup = ({ children, className, ...props }) => {
  return (
    <div
      className={clsx(
        'inline-flex rounded-md shadow-sm',
        '[&>button]:rounded-none',
        '[&>button:first-child]:rounded-l-md',
        '[&>button:last-child]:rounded-r-md',
        '[&>button:not(:first-child)]:border-l-0',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Button;
