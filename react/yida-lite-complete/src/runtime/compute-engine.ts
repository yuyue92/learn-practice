/**
 * Compute Engine - 增强版计算引擎
 * Phase 2: 支持更多计算函数和条件计算
 * 
 * 支持函数：
 * - SUM: 求和
 * - COUNT: 计数
 * - AVG: 平均值
 * - MAX: 最大值
 * - MIN: 最小值
 * - CONCAT: 文本拼接
 */

import { ComputationConfig, FieldSchema, FieldType } from '../schema/types';

// ============ 计算函数类型 ============
export type ComputeFunction = 'SUM' | 'COUNT' | 'AVG' | 'MAX' | 'MIN' | 'CONCAT';

// ============ 增强的计算配置 ============
export interface EnhancedComputationConfig extends ComputationConfig {
  function: ComputeFunction;
  sourceField: string;           // 格式: subTableKey.fieldKey 或 fieldKey
  precision?: number;            // 小数精度
  filter?: ComputeFilter;        // 条件过滤（可选）
  separator?: string;            // CONCAT 分隔符
}

// ============ 计算过滤条件 ============
export interface ComputeFilter {
  field: string;                 // 过滤字段
  operator: 'eq' | 'neq' | 'gt' | 'lt' | 'contains';
  value: unknown;
}

// ============ 计算结果 ============
export interface ComputeResult {
  value: number | string;
  sourceCount: number;           // 参与计算的数据数量
  filteredCount?: number;        // 过滤后的数据数量
}

// ============ 计算引擎 ============
export class ComputeEngine {
  
  /**
   * 执行计算
   */
  calculate(
    config: EnhancedComputationConfig,
    formData: Record<string, unknown>
  ): ComputeResult {
    const { sourceField, filter } = config;
    
    // 解析数据源
    let values: unknown[];
    let sourceCount: number;
    
    if (sourceField.includes('.')) {
      // 子表字段: subTable.fieldKey
      const [tableKey, fieldKey] = sourceField.split('.');
      const rows = formData[tableKey] as Array<Record<string, unknown>> | undefined;
      
      if (!Array.isArray(rows)) {
        return { value: this.getEmptyValue(config.function), sourceCount: 0 };
      }
      
      sourceCount = rows.length;
      
      // 应用过滤条件
      let filteredRows = rows;
      if (filter) {
        filteredRows = this.applyFilter(rows, filter);
      }
      
      values = filteredRows.map(row => row[fieldKey]);
      
      return {
        value: this.compute(config, values),
        sourceCount,
        filteredCount: filteredRows.length,
      };
    } else {
      // 普通字段（用于将来扩展）
      const value = formData[sourceField];
      return {
        value: this.compute(config, [value]),
        sourceCount: 1,
      };
    }
  }

  /**
   * 批量计算所有计算字段
   */
  calculateAll(
    fields: FieldSchema[],
    formData: Record<string, unknown>
  ): Map<string, ComputeResult> {
    const results = new Map<string, ComputeResult>();
    
    const processFields = (fieldList: FieldSchema[]) => {
      for (const field of fieldList) {
        if (field.fieldType === FieldType.COMPUTED && field.computation) {
          const result = this.calculate(
            field.computation as EnhancedComputationConfig,
            formData
          );
          results.set(field.fieldId, result);
        }
        
        // 递归处理子字段（虽然计算字段不能在子表内，但保持扩展性）
        if (field.children) {
          processFields(field.children);
        }
      }
    };
    
    processFields(fields);
    return results;
  }

  /**
   * 执行具体计算
   */
  private compute(config: EnhancedComputationConfig, values: unknown[]): number | string {
    const { function: fn, precision = 2, separator = ', ' } = config;
    
    switch (fn) {
      case 'SUM':
        return this.sum(values, precision);
      
      case 'COUNT':
        return this.count(values);
      
      case 'AVG':
        return this.avg(values, precision);
      
      case 'MAX':
        return this.max(values, precision);
      
      case 'MIN':
        return this.min(values, precision);
      
      case 'CONCAT':
        return this.concat(values, separator);
      
      default:
        console.warn(`未知计算函数: ${fn}`);
        return 0;
    }
  }

  /**
   * 求和
   */
  private sum(values: unknown[], precision: number): number {
    const nums = this.toNumbers(values);
    const result = nums.reduce((acc, val) => acc + val, 0);
    return this.round(result, precision);
  }

  /**
   * 计数（非空值）
   */
  private count(values: unknown[]): number {
    return values.filter(v => 
      v !== null && v !== undefined && v !== '' && !Number.isNaN(v)
    ).length;
  }

  /**
   * 平均值
   */
  private avg(values: unknown[], precision: number): number {
    const nums = this.toNumbers(values);
    if (nums.length === 0) return 0;
    const result = nums.reduce((acc, val) => acc + val, 0) / nums.length;
    return this.round(result, precision);
  }

  /**
   * 最大值
   */
  private max(values: unknown[], precision: number): number {
    const nums = this.toNumbers(values);
    if (nums.length === 0) return 0;
    const result = Math.max(...nums);
    return this.round(result, precision);
  }

  /**
   * 最小值
   */
  private min(values: unknown[], precision: number): number {
    const nums = this.toNumbers(values);
    if (nums.length === 0) return 0;
    const result = Math.min(...nums);
    return this.round(result, precision);
  }

  /**
   * 文本拼接
   */
  private concat(values: unknown[], separator: string): string {
    return values
      .filter(v => v !== null && v !== undefined && v !== '')
      .map(v => String(v))
      .join(separator);
  }

  /**
   * 转换为数字数组
   */
  private toNumbers(values: unknown[]): number[] {
    return values
      .map(v => {
        if (typeof v === 'number') return v;
        if (typeof v === 'string') {
          const num = parseFloat(v);
          return isNaN(num) ? null : num;
        }
        return null;
      })
      .filter((v): v is number => v !== null);
  }

  /**
   * 四舍五入
   */
  private round(value: number, precision: number): number {
    const factor = Math.pow(10, precision);
    return Math.round(value * factor) / factor;
  }

  /**
   * 应用过滤条件
   */
  private applyFilter(
    rows: Array<Record<string, unknown>>,
    filter: ComputeFilter
  ): Array<Record<string, unknown>> {
    return rows.filter(row => {
      const fieldValue = row[filter.field];
      
      switch (filter.operator) {
        case 'eq':
          return fieldValue === filter.value;
        case 'neq':
          return fieldValue !== filter.value;
        case 'gt':
          return Number(fieldValue) > Number(filter.value);
        case 'lt':
          return Number(fieldValue) < Number(filter.value);
        case 'contains':
          return String(fieldValue).includes(String(filter.value));
        default:
          return true;
      }
    });
  }

  /**
   * 获取空值
   */
  private getEmptyValue(fn: ComputeFunction): number | string {
    return fn === 'CONCAT' ? '' : 0;
  }

  /**
   * 获取依赖字段
   */
  getDependencies(config: EnhancedComputationConfig): string[] {
    const deps: string[] = [];
    
    // 主数据源
    if (config.sourceField.includes('.')) {
      const [tableKey] = config.sourceField.split('.');
      deps.push(tableKey);
    } else {
      deps.push(config.sourceField);
    }
    
    // 过滤条件字段
    if (config.filter) {
      deps.push(config.filter.field);
    }
    
    return deps;
  }
}

// ============ 计算函数定义 ============
export const COMPUTE_FUNCTIONS: Array<{
  value: ComputeFunction;
  label: string;
  description: string;
  resultType: 'number' | 'string';
}> = [
  { value: 'SUM', label: '求和', description: '计算数值总和', resultType: 'number' },
  { value: 'COUNT', label: '计数', description: '计算非空值数量', resultType: 'number' },
  { value: 'AVG', label: '平均值', description: '计算数值平均值', resultType: 'number' },
  { value: 'MAX', label: '最大值', description: '获取最大数值', resultType: 'number' },
  { value: 'MIN', label: '最小值', description: '获取最小数值', resultType: 'number' },
  { value: 'CONCAT', label: '拼接', description: '拼接文本内容', resultType: 'string' },
];

// ============ 导出单例 ============
export const computeEngine = new ComputeEngine();
