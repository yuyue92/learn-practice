/**
 * 加载遮罩组件
 * 全局加载状态显示
 */
import clsx from 'clsx';

/**
 * 加载遮罩组件
 */
const LoadingOverlay = ({ text = '加载中...' }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-neutral-900/80">
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-primary-200 dark:border-primary-800 rounded-full" />
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
        {text && (
          <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

/**
 * 局部加载组件
 */
export const Loading = ({ size = 'md', className }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={clsx('flex items-center justify-center', className)}>
      <div
        className={clsx(
          'border-primary-600 border-t-transparent rounded-full animate-spin',
          sizeClasses[size]
        )}
      />
    </div>
  );
};

/**
 * 骨架屏组件
 */
export const Skeleton = ({
  width,
  height = '1rem',
  rounded = 'md',
  className,
  animated = true,
}) => {
  return (
    <div
      className={clsx(
        'bg-neutral-200 dark:bg-neutral-700',
        animated && 'animate-pulse',
        rounded === 'sm' && 'rounded-sm',
        rounded === 'md' && 'rounded',
        rounded === 'lg' && 'rounded-lg',
        rounded === 'full' && 'rounded-full',
        rounded === 'none' && 'rounded-none',
        className
      )}
      style={{ width, height }}
    />
  );
};

/**
 * 表格骨架屏
 */
export const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="space-y-3">
      {/* 表头 */}
      <div className="flex gap-4 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-t-lg">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} width={`${100 / columns}%`} height="1rem" />
        ))}
      </div>
      {/* 表体 */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="flex gap-4 p-4 bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} width={`${100 / columns}%`} height="1rem" />
          ))}
        </div>
      ))}
    </div>
  );
};

/**
 * 卡片骨架屏
 */
export const CardSkeleton = () => {
  return (
    <div className="p-6 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
      <div className="flex items-center gap-4 mb-4">
        <Skeleton width="3rem" height="3rem" rounded="full" />
        <div className="flex-1 space-y-2">
          <Skeleton width="60%" height="1rem" />
          <Skeleton width="40%" height="0.75rem" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton width="100%" height="0.75rem" />
        <Skeleton width="100%" height="0.75rem" />
        <Skeleton width="70%" height="0.75rem" />
      </div>
    </div>
  );
};

/**
 * 列表骨架屏
 */
export const ListSkeleton = ({ rows = 5 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 p-4 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700"
        >
          <Skeleton width="2.5rem" height="2.5rem" rounded="lg" />
          <div className="flex-1 space-y-2">
            <Skeleton width="60%" height="1rem" />
            <Skeleton width="40%" height="0.75rem" />
          </div>
          <Skeleton width="5rem" height="2rem" rounded="md" />
        </div>
      ))}
    </div>
  );
};

export default LoadingOverlay;
