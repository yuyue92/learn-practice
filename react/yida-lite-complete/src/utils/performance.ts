/**
 * Performance Utilities - 性能优化工具
 * Phase 3 Week 12: 性能优化
 * 
 * 功能：
 * - 虚拟滚动（大数据列表）
 * - 防抖/节流
 * - Schema 缓存
 * - 计算结果缓存
 * - 性能监控
 */

// ============ 防抖函数 ============
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

// ============ 节流函数 ============
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now();
    const remaining = limit - (now - lastCall);

    if (remaining <= 0) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      lastCall = now;
      fn.apply(this, args);
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        timeoutId = null;
        fn.apply(this, args);
      }, remaining);
    }
  };
}

// ============ LRU 缓存 ============
export class LRUCache<K, V> {
  private cache: Map<K, V> = new Map();
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  get(key: K): V | undefined {
    if (!this.cache.has(key)) {
      return undefined;
    }
    
    // 移到最后（最近使用）
    const value = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // 删除最旧的（第一个）
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }

  delete(key: K): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// ============ 计算结果缓存 ============
export class ComputeCache {
  private cache: LRUCache<string, unknown>;
  private dependencies: Map<string, Set<string>> = new Map();

  constructor(maxSize: number = 200) {
    this.cache = new LRUCache(maxSize);
  }

  /**
   * 生成缓存键
   */
  private generateKey(
    computeId: string,
    data: Record<string, unknown>
  ): string {
    // 只包含相关字段的数据
    const deps = this.dependencies.get(computeId) || new Set();
    const relevantData: Record<string, unknown> = {};
    
    for (const key of deps) {
      relevantData[key] = data[key];
    }

    return `${computeId}:${JSON.stringify(relevantData)}`;
  }

  /**
   * 注册计算字段的依赖
   */
  registerDependencies(computeId: string, fieldKeys: string[]): void {
    this.dependencies.set(computeId, new Set(fieldKeys));
  }

  /**
   * 获取缓存的计算结果
   */
  get(computeId: string, data: Record<string, unknown>): unknown | undefined {
    const key = this.generateKey(computeId, data);
    return this.cache.get(key);
  }

  /**
   * 缓存计算结果
   */
  set(
    computeId: string,
    data: Record<string, unknown>,
    result: unknown
  ): void {
    const key = this.generateKey(computeId, data);
    this.cache.set(key, result);
  }

  /**
   * 使指定字段相关的缓存失效
   */
  invalidate(fieldKey: string): void {
    // 找出所有依赖该字段的计算
    for (const [computeId, deps] of this.dependencies) {
      if (deps.has(fieldKey)) {
        // 清除该计算的所有缓存（简化实现）
        this.cache.clear();
        break;
      }
    }
  }

  /**
   * 清空所有缓存
   */
  clear(): void {
    this.cache.clear();
  }
}

// ============ 虚拟滚动配置 ============
export interface VirtualScrollConfig {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

// ============ 虚拟滚动结果 ============
export interface VirtualScrollResult<T> {
  visibleItems: Array<{ item: T; index: number; style: { top: number } }>;
  totalHeight: number;
  startIndex: number;
  endIndex: number;
}

// ============ 虚拟滚动计算 ============
export function calculateVirtualScroll<T>(
  items: T[],
  scrollTop: number,
  config: VirtualScrollConfig
): VirtualScrollResult<T> {
  const { itemHeight, containerHeight, overscan = 3 } = config;
  
  const totalHeight = items.length * itemHeight;
  
  // 计算可见范围
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleCount = Math.ceil(containerHeight / itemHeight) + 2 * overscan;
  const endIndex = Math.min(items.length - 1, startIndex + visibleCount);

  // 生成可见项
  const visibleItems = [];
  for (let i = startIndex; i <= endIndex; i++) {
    visibleItems.push({
      item: items[i],
      index: i,
      style: { top: i * itemHeight },
    });
  }

  return {
    visibleItems,
    totalHeight,
    startIndex,
    endIndex,
  };
}

// ============ 性能监控 ============
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();
  private maxSamples: number = 100;

  /**
   * 开始计时
   */
  start(name: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const duration = performance.now() - startTime;
      this.record(name, duration);
    };
  }

  /**
   * 记录指标
   */
  record(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    const samples = this.metrics.get(name)!;
    samples.push(value);
    
    // 限制样本数量
    if (samples.length > this.maxSamples) {
      samples.shift();
    }
  }

  /**
   * 获取统计信息
   */
  getStats(name: string): {
    count: number;
    avg: number;
    min: number;
    max: number;
    p95: number;
  } | null {
    const samples = this.metrics.get(name);
    if (!samples || samples.length === 0) {
      return null;
    }

    const sorted = [...samples].sort((a, b) => a - b);
    const sum = sorted.reduce((a, b) => a + b, 0);
    const p95Index = Math.floor(sorted.length * 0.95);

    return {
      count: sorted.length,
      avg: sum / sorted.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      p95: sorted[p95Index],
    };
  }

  /**
   * 获取所有指标
   */
  getAllStats(): Record<string, ReturnType<typeof this.getStats>> {
    const result: Record<string, ReturnType<typeof this.getStats>> = {};
    
    for (const name of this.metrics.keys()) {
      result[name] = this.getStats(name);
    }
    
    return result;
  }

  /**
   * 清空所有指标
   */
  clear(): void {
    this.metrics.clear();
  }

  /**
   * 打印报告
   */
  report(): void {
    console.group('📊 Performance Report');
    
    for (const [name, samples] of this.metrics) {
      const stats = this.getStats(name);
      if (stats) {
        console.log(
          `${name}: avg=${stats.avg.toFixed(2)}ms, ` +
          `min=${stats.min.toFixed(2)}ms, ` +
          `max=${stats.max.toFixed(2)}ms, ` +
          `p95=${stats.p95.toFixed(2)}ms ` +
          `(${stats.count} samples)`
        );
      }
    }
    
    console.groupEnd();
  }
}

// ============ 批量更新优化 ============
export class BatchUpdater<T> {
  private pending: T[] = [];
  private timer: ReturnType<typeof setTimeout> | null = null;
  private batchSize: number;
  private delay: number;
  private processor: (items: T[]) => void;

  constructor(
    processor: (items: T[]) => void,
    options: { batchSize?: number; delay?: number } = {}
  ) {
    this.processor = processor;
    this.batchSize = options.batchSize || 50;
    this.delay = options.delay || 16; // ~60fps
  }

  /**
   * 添加待处理项
   */
  add(item: T): void {
    this.pending.push(item);

    if (this.pending.length >= this.batchSize) {
      this.flush();
    } else if (!this.timer) {
      this.timer = setTimeout(() => this.flush(), this.delay);
    }
  }

  /**
   * 立即处理所有待处理项
   */
  flush(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    if (this.pending.length > 0) {
      const items = this.pending;
      this.pending = [];
      this.processor(items);
    }
  }

  /**
   * 清空待处理项
   */
  clear(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.pending = [];
  }
}

// ============ Memoize 装饰器 ============
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  keyGenerator?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();

  return function (this: any, ...args: Parameters<T>): ReturnType<T> {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  } as T;
}

// ============ 导出单例 ============
export const performanceMonitor = new PerformanceMonitor();
export const computeCache = new ComputeCache();
