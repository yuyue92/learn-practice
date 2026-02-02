/**
 * 全局搜索组件
 * 支持跨模块搜索客户、产品、订单等
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import {
  HiOutlineSearch,
  HiOutlineX,
  HiOutlineUser,
  HiOutlineCube,
  HiOutlineShoppingCart,
  HiOutlineDocumentText,
  HiOutlineClock,
} from 'react-icons/hi';
import { useAppStore } from '@/stores';
import { debounce } from '@/utils/helpers';
import { ROUTES } from '@/constants/routes';

// 搜索类型图标映射
const typeIcons = {
  customer: HiOutlineUser,
  product: HiOutlineCube,
  order: HiOutlineShoppingCart,
  quote: HiOutlineDocumentText,
};

// 搜索类型标签映射
const typeLabels = {
  customer: '客户',
  product: '产品',
  order: '订单',
  quote: '报价单',
};

/**
 * 全局搜索组件
 */
const GlobalSearch = () => {
  const navigate = useNavigate();
  const { hideSearch, recentSearches, addRecentSearch, clearRecentSearches } = useAppStore();
  const inputRef = useRef(null);
  
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  // 自动聚焦
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // 键盘事件
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        hideSearch();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(prev => prev > 0 ? prev - 1 : -1);
      } else if (e.key === 'Enter' && activeIndex >= 0) {
        handleSelect(results[activeIndex]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [hideSearch, results, activeIndex]);

  // 搜索逻辑（模拟）
  const doSearch = useCallback(
    debounce(async (query) => {
      if (!query.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      
      // 模拟搜索结果
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const mockResults = [
        { id: '1', type: 'customer', title: '张三科技有限公司', subtitle: '联系人: 张三 | 电话: 138****8000' },
        { id: '2', type: 'customer', title: '李四贸易公司', subtitle: '联系人: 李四 | 电话: 139****9000' },
        { id: '3', type: 'product', title: '高端服务器A型', subtitle: '库存: 50 | 单价: ¥25,000' },
        { id: '4', type: 'order', title: 'SO-2024-0001', subtitle: '客户: 张三科技 | 金额: ¥150,000' },
        { id: '5', type: 'quote', title: 'QT-2024-0001', subtitle: '客户: 李四贸易 | 金额: ¥80,000' },
      ].filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(query.toLowerCase())
      );

      setResults(mockResults);
      setLoading(false);
    }, 300),
    []
  );

  // 监听关键词变化
  useEffect(() => {
    doSearch(keyword);
  }, [keyword, doSearch]);

  // 选择结果
  const handleSelect = (item) => {
    addRecentSearch(item.title);
    
    // 跳转到对应页面
    const routeMap = {
      customer: `/customer/detail/${item.id}`,
      product: `/product/detail/${item.id}`,
      order: `/sales/order/detail/${item.id}`,
      quote: `/sales/quote/detail/${item.id}`,
    };
    
    navigate(routeMap[item.type] || ROUTES.DASHBOARD);
    hideSearch();
  };

  // 使用最近搜索
  const handleUseRecent = (text) => {
    setKeyword(text);
    inputRef.current?.focus();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
      {/* 遮罩 */}
      <div
        className="absolute inset-0 bg-black/50 animate-fade-in"
        onClick={hideSearch}
      />

      {/* 搜索框 */}
      <div className={clsx(
        'relative w-full max-w-2xl bg-white rounded-xl shadow-modal',
        'dark:bg-neutral-800',
        'animate-scale-in'
      )}>
        {/* 输入区域 */}
        <div className="flex items-center px-4 border-b border-neutral-200 dark:border-neutral-700">
          <HiOutlineSearch className="w-5 h-5 text-neutral-400" />
          <input
            ref={inputRef}
            type="text"
            className={clsx(
              'flex-1 px-3 py-4 bg-transparent border-none outline-none',
              'text-neutral-900 dark:text-neutral-100',
              'placeholder:text-neutral-400 dark:placeholder:text-neutral-500'
            )}
            placeholder="搜索客户、产品、订单..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          {keyword && (
            <button
              className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700"
              onClick={() => setKeyword('')}
            >
              <HiOutlineX className="w-4 h-4 text-neutral-400" />
            </button>
          )}
          <div className="ml-2 px-2 py-1 text-xs text-neutral-400 bg-neutral-100 dark:bg-neutral-700 rounded">
            ESC
          </div>
        </div>

        {/* 搜索结果 / 最近搜索 */}
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="py-12 text-center">
              <div className="w-6 h-6 mx-auto border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
              <p className="mt-2 text-sm text-neutral-500">搜索中...</p>
            </div>
          ) : keyword ? (
            results.length > 0 ? (
              <div className="py-2">
                {results.map((item, index) => {
                  const Icon = typeIcons[item.type];
                  return (
                    <div
                      key={item.id}
                      className={clsx(
                        'flex items-center gap-3 px-4 py-3 cursor-pointer',
                        'transition-colors duration-150',
                        index === activeIndex
                          ? 'bg-primary-50 dark:bg-primary-900/30'
                          : 'hover:bg-neutral-50 dark:hover:bg-neutral-700'
                      )}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setActiveIndex(index)}
                    >
                      <div className={clsx(
                        'w-10 h-10 rounded-lg flex items-center justify-center',
                        'bg-neutral-100 dark:bg-neutral-700'
                      )}>
                        {Icon && <Icon className="w-5 h-5 text-neutral-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-neutral-900 dark:text-neutral-100 truncate">
                            {item.title}
                          </span>
                          <span className={clsx(
                            'px-1.5 py-0.5 text-xs rounded',
                            'bg-neutral-100 text-neutral-600',
                            'dark:bg-neutral-700 dark:text-neutral-400'
                          )}>
                            {typeLabels[item.type]}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-500 truncate">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center text-neutral-500">
                未找到相关结果
              </div>
            )
          ) : recentSearches.length > 0 ? (
            <div className="py-2">
              <div className="flex items-center justify-between px-4 py-2">
                <span className="text-xs font-medium text-neutral-500 uppercase">
                  最近搜索
                </span>
                <button
                  className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400"
                  onClick={clearRecentSearches}
                >
                  清除
                </button>
              </div>
              {recentSearches.map((text, index) => (
                <div
                  key={index}
                  className={clsx(
                    'flex items-center gap-3 px-4 py-2 cursor-pointer',
                    'hover:bg-neutral-50 dark:hover:bg-neutral-700',
                    'transition-colors duration-150'
                  )}
                  onClick={() => handleUseRecent(text)}
                >
                  <HiOutlineClock className="w-4 h-4 text-neutral-400" />
                  <span className="text-neutral-700 dark:text-neutral-300">
                    {text}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-neutral-500">
              <HiOutlineSearch className="w-12 h-12 mx-auto mb-2 text-neutral-300" />
              <p>输入关键词开始搜索</p>
            </div>
          )}
        </div>

        {/* 底部提示 */}
        <div className="flex items-center justify-center gap-4 px-4 py-3 border-t border-neutral-200 dark:border-neutral-700 text-xs text-neutral-400">
          <span>
            <kbd className="px-1 py-0.5 bg-neutral-100 dark:bg-neutral-700 rounded">↑</kbd>
            <kbd className="px-1 py-0.5 ml-1 bg-neutral-100 dark:bg-neutral-700 rounded">↓</kbd>
            <span className="ml-1">导航</span>
          </span>
          <span>
            <kbd className="px-1 py-0.5 bg-neutral-100 dark:bg-neutral-700 rounded">Enter</kbd>
            <span className="ml-1">选择</span>
          </span>
          <span>
            <kbd className="px-1 py-0.5 bg-neutral-100 dark:bg-neutral-700 rounded">Esc</kbd>
            <span className="ml-1">关闭</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;
