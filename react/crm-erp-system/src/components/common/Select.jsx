/**
 * 下拉选择组件
 * 企业级通用选择框
 */
import { forwardRef, useState, useRef, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import { HiOutlineChevronDown, HiOutlineCheck, HiOutlineX } from 'react-icons/hi';

/**
 * 选择框尺寸样式映射
 */
const sizeStyles = {
  sm: 'px-2.5 py-1.5 text-xs',
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-3 text-base',
};

/**
 * 下拉选择组件
 */
const Select = forwardRef(({
  options = [],
  value,
  onChange,
  placeholder = '请选择',
  size = 'md',
  error = false,
  disabled = false,
  clearable = false,
  searchable = false,
  multiple = false,
  className,
  ...props
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearchText('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 过滤选项
  const filteredOptions = searchable && searchText
    ? options.filter(opt => 
        opt.label.toLowerCase().includes(searchText.toLowerCase())
      )
    : options;

  // 获取选中的显示文本
  const getDisplayText = useCallback(() => {
    if (multiple) {
      if (!value || value.length === 0) return '';
      const selectedLabels = value.map(v => {
        const opt = options.find(o => o.value === v);
        return opt?.label || v;
      });
      return selectedLabels.join(', ');
    }
    
    const selectedOption = options.find(opt => opt.value === value);
    return selectedOption?.label || '';
  }, [value, options, multiple]);

  // 处理选择
  const handleSelect = (optionValue) => {
    if (multiple) {
      const currentValue = value || [];
      const newValue = currentValue.includes(optionValue)
        ? currentValue.filter(v => v !== optionValue)
        : [...currentValue, optionValue];
      onChange?.(newValue);
    } else {
      onChange?.(optionValue);
      setIsOpen(false);
      setSearchText('');
    }
  };

  // 处理清除
  const handleClear = (e) => {
    e.stopPropagation();
    onChange?.(multiple ? [] : null);
  };

  // 检查是否选中
  const isSelected = (optionValue) => {
    if (multiple) {
      return (value || []).includes(optionValue);
    }
    return value === optionValue;
  };

  const containerClasses = clsx(
    'relative w-full',
    className
  );

  const triggerClasses = clsx(
    'w-full flex items-center justify-between',
    'bg-white border rounded-md cursor-pointer transition-colors duration-200',
    'dark:bg-neutral-800',
    // 边框颜色
    error
      ? 'border-danger-500'
      : isOpen
        ? 'border-primary-500 ring-2 ring-primary-500/20'
        : 'border-neutral-300 hover:border-neutral-400 dark:border-neutral-600',
    // 禁用状态
    disabled && 'bg-neutral-100 cursor-not-allowed dark:bg-neutral-700',
    sizeStyles[size]
  );

  const dropdownClasses = clsx(
    'absolute z-dropdown w-full mt-1 py-1',
    'bg-white border border-neutral-200 rounded-lg shadow-dropdown',
    'dark:bg-neutral-800 dark:border-neutral-700',
    'max-h-60 overflow-auto',
    'animate-fade-in'
  );

  const optionClasses = (selected, disabled) => clsx(
    'flex items-center justify-between px-3 py-2 cursor-pointer',
    'transition-colors duration-150',
    selected
      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
      : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700',
    disabled && 'opacity-50 cursor-not-allowed'
  );

  const displayText = getDisplayText();
  const hasValue = multiple ? (value && value.length > 0) : (value !== null && value !== undefined && value !== '');

  return (
    <div ref={containerRef} className={containerClasses}>
      {/* 触发器 */}
      <div
        ref={ref}
        className={triggerClasses}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        {...props}
      >
        {searchable && isOpen ? (
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-neutral-900 dark:text-neutral-100"
            placeholder={displayText || placeholder}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            autoFocus
          />
        ) : (
          <span className={clsx(
            'flex-1 truncate text-left',
            hasValue ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-400 dark:text-neutral-500'
          )}>
            {displayText || placeholder}
          </span>
        )}

        <div className="flex items-center gap-1 ml-2">
          {clearable && hasValue && !disabled && (
            <button
              type="button"
              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
              onClick={handleClear}
            >
              <HiOutlineX className="w-4 h-4" />
            </button>
          )}
          <HiOutlineChevronDown
            className={clsx(
              'w-4 h-4 text-neutral-400 transition-transform duration-200',
              isOpen && 'transform rotate-180'
            )}
          />
        </div>
      </div>

      {/* 下拉列表 */}
      {isOpen && !disabled && (
        <div className={dropdownClasses}>
          {filteredOptions.length === 0 ? (
            <div className="px-3 py-6 text-center text-neutral-500">
              暂无数据
            </div>
          ) : (
            filteredOptions.map((option) => (
              <div
                key={option.value}
                className={optionClasses(isSelected(option.value), option.disabled)}
                onClick={() => !option.disabled && handleSelect(option.value)}
              >
                <span className="truncate">{option.label}</span>
                {isSelected(option.value) && (
                  <HiOutlineCheck className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
});

Select.displayName = 'Select';

/**
 * 原生选择框组件（表单友好）
 */
export const NativeSelect = forwardRef(({
  options = [],
  placeholder = '请选择',
  size = 'md',
  error = false,
  disabled = false,
  className,
  ...props
}, ref) => {
  const selectClasses = clsx(
    'w-full bg-white border rounded-md outline-none cursor-pointer',
    'appearance-none bg-no-repeat',
    'transition-colors duration-200',
    'dark:bg-neutral-800 dark:text-neutral-100',
    // 边框颜色
    error
      ? 'border-danger-500 focus:border-danger-500 focus:ring-2 focus:ring-danger-500/20'
      : 'border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-600 dark:focus:border-primary-400',
    // 禁用状态
    disabled && 'bg-neutral-100 cursor-not-allowed dark:bg-neutral-700',
    sizeStyles[size],
    'pr-10',
    className
  );

  return (
    <div className="relative">
      <select
        ref={ref}
        className={selectClasses}
        disabled={disabled}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      <HiOutlineChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
    </div>
  );
});

NativeSelect.displayName = 'NativeSelect';

export default Select;
