/**
 * 加载组件
 */

function Loading({ size = 'md', text = '加载中...' }) {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className={`${sizes[size]} border-4 border-primary-200 dark:border-primary-800 border-t-primary-600 dark:border-t-primary-400 rounded-full animate-spin`} />
      {text && (
        <p className="text-sm text-neutral-600 dark:text-neutral-400">{text}</p>
      )}
    </div>
  );
}

export default Loading;
