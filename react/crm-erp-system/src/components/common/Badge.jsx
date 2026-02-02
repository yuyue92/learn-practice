/**
 * 徽章和标签组件
 * 用于状态显示、分类标记等场景
 */
import clsx from 'clsx';

/**
 * 徽章颜色映射
 */
const badgeColors = {
  primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-300',
  secondary: 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900/50 dark:text-secondary-300',
  success: 'bg-success-100 text-success-800 dark:bg-success-900/50 dark:text-success-300',
  warning: 'bg-warning-100 text-warning-800 dark:bg-warning-900/50 dark:text-warning-300',
  danger: 'bg-danger-100 text-danger-800 dark:bg-danger-900/50 dark:text-danger-300',
  neutral: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-300',
};

/**
 * 徽章尺寸映射
 */
const badgeSizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-xs',
  lg: 'px-3 py-1 text-sm',
};

/**
 * 徽章组件
 * @param {Object} props
 * @param {string} props.color - 颜色：primary | secondary | success | warning | danger | neutral
 * @param {string} props.size - 尺寸：sm | md | lg
 * @param {boolean} props.dot - 是否显示圆点
 * @param {React.ReactNode} props.children - 内容
 */
const Badge = ({
  color = 'primary',
  size = 'md',
  dot = false,
  children,
  className,
  ...props
}) => {
  const badgeClasses = clsx(
    'inline-flex items-center font-medium rounded-full',
    badgeColors[color],
    badgeSizes[size],
    className
  );

  return (
    <span className={badgeClasses} {...props}>
      {dot && (
        <span className={clsx(
          'w-1.5 h-1.5 rounded-full mr-1.5',
          color === 'primary' && 'bg-primary-500',
          color === 'secondary' && 'bg-secondary-500',
          color === 'success' && 'bg-success-500',
          color === 'warning' && 'bg-warning-500',
          color === 'danger' && 'bg-danger-500',
          color === 'neutral' && 'bg-neutral-500'
        )} />
      )}
      {children}
    </span>
  );
};

/**
 * 状态徽章组件 - 带圆点的徽章
 */
export const StatusBadge = ({
  status,
  statusMap = {},
  colorMap = {},
  ...props
}) => {
  const label = statusMap[status] || status;
  const color = colorMap[status] || 'neutral';

  return (
    <Badge color={color} dot {...props}>
      {label}
    </Badge>
  );
};

/**
 * 标签颜色映射
 */
const tagColors = {
  primary: 'bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-900/30 dark:text-primary-300 dark:border-primary-700',
  secondary: 'bg-secondary-50 text-secondary-700 border-secondary-200 dark:bg-secondary-900/30 dark:text-secondary-300 dark:border-secondary-700',
  success: 'bg-success-50 text-success-700 border-success-200 dark:bg-success-900/30 dark:text-success-300 dark:border-success-700',
  warning: 'bg-warning-50 text-warning-700 border-warning-200 dark:bg-warning-900/30 dark:text-warning-300 dark:border-warning-700',
  danger: 'bg-danger-50 text-danger-700 border-danger-200 dark:bg-danger-900/30 dark:text-danger-300 dark:border-danger-700',
  neutral: 'bg-neutral-50 text-neutral-700 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-600',
};

/**
 * 标签组件
 */
export const Tag = ({
  color = 'neutral',
  size = 'md',
  closable = false,
  onClose,
  children,
  className,
  ...props
}) => {
  const tagClasses = clsx(
    'inline-flex items-center border rounded',
    tagColors[color],
    size === 'sm' && 'px-1.5 py-0.5 text-xs',
    size === 'md' && 'px-2 py-0.5 text-xs',
    size === 'lg' && 'px-2.5 py-1 text-sm',
    className
  );

  return (
    <span className={tagClasses} {...props}>
      {children}
      {closable && (
        <button
          type="button"
          className="ml-1 -mr-0.5 p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10"
          onClick={(e) => {
            e.stopPropagation();
            onClose?.();
          }}
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
};

/**
 * 标签组组件
 */
export const TagGroup = ({ children, className, ...props }) => {
  return (
    <div className={clsx('flex flex-wrap gap-1', className)} {...props}>
      {children}
    </div>
  );
};

/**
 * 数字徽章组件
 */
export const CountBadge = ({
  count = 0,
  max = 99,
  showZero = false,
  dot = false,
  color = 'danger',
  className,
  children,
}) => {
  const showBadge = dot || (showZero ? true : count > 0);
  const displayCount = count > max ? `${max}+` : count;

  return (
    <span className="relative inline-flex">
      {children}
      {showBadge && (
        <span
          className={clsx(
            'absolute -top-1 -right-1 flex items-center justify-center',
            'font-medium text-white rounded-full',
            dot
              ? 'w-2 h-2'
              : 'min-w-[18px] h-[18px] px-1 text-xs',
            color === 'primary' && 'bg-primary-500',
            color === 'secondary' && 'bg-secondary-500',
            color === 'success' && 'bg-success-500',
            color === 'warning' && 'bg-warning-500',
            color === 'danger' && 'bg-danger-500',
            className
          )}
        >
          {!dot && displayCount}
        </span>
      )}
    </span>
  );
};

/**
 * 进度条组件
 */
export const Progress = ({
  percent = 0,
  size = 'md',
  color = 'primary',
  showLabel = true,
  className,
}) => {
  const validPercent = Math.min(Math.max(percent, 0), 100);

  const heightMap = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const colorMap = {
    primary: 'bg-primary-500',
    secondary: 'bg-secondary-500',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    danger: 'bg-danger-500',
  };

  return (
    <div className={clsx('w-full', className)}>
      <div className={clsx(
        'w-full bg-neutral-200 rounded-full overflow-hidden dark:bg-neutral-700',
        heightMap[size]
      )}>
        <div
          className={clsx(
            'h-full rounded-full transition-all duration-300',
            colorMap[color]
          )}
          style={{ width: `${validPercent}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-end mt-1">
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            {validPercent.toFixed(0)}%
          </span>
        </div>
      )}
    </div>
  );
};

export default Badge;
