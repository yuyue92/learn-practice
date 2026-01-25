/**
 * Rule Engine Lite
 * 轻量级规则引擎 - Phase 2 核心能力
 * 
 * 设计目标：让业务能"动"，但不让配置失控
 * 
 * 支持规则类型：
 * 1. visibility - 显隐规则
 * 2. required - 必填规则  
 * 3. setValue - 赋值规则
 * 
 * 严格限制：
 * - 单条件
 * - 单字段
 * - 无嵌套
 * - 无脚本
 */

import { RuleSchema, RuleType, CompareOperator, FormData } from '../schema/types';

// ============ 规则评估结果 ============
export interface RuleEvaluationResult {
  visibility: Map<string, boolean>;    // fieldId -> visible
  required: Map<string, boolean>;      // fieldId -> required
  setValue: Map<string, unknown>;      // fieldId -> value
  triggeredRules: string[];            // 触发的规则ID列表
}

// ============ 规则执行上下文 ============
export interface RuleContext {
  formData: FormData;
  fieldKeyToId: Map<string, string>;   // fieldKey -> fieldId 映射
  fieldIdToKey: Map<string, string>;   // fieldId -> fieldKey 映射
}

// ============ 规则引擎 ============
export class RuleEngineLite {
  
  /**
   * 评估所有规则
   */
  evaluate(rules: RuleSchema[], context: RuleContext): RuleEvaluationResult {
    const result: RuleEvaluationResult = {
      visibility: new Map(),
      required: new Map(),
      setValue: new Map(),
      triggeredRules: [],
    };

    // 按规则类型分组处理，确保执行顺序
    const sortedRules = this.sortRulesByPriority(rules);

    for (const rule of sortedRules) {
      try {
        const conditionMet = this.evaluateCondition(rule, context);
        
        if (conditionMet) {
          this.applyAction(rule, result);
          result.triggeredRules.push(rule.ruleId);
        }
      } catch (error) {
        console.warn(`规则 ${rule.ruleName} 执行失败:`, error);
      }
    }

    return result;
  }

  /**
   * 按优先级排序规则
   * 执行顺序：setValue -> required -> visibility
   */
  private sortRulesByPriority(rules: RuleSchema[]): RuleSchema[] {
    const priority: Record<RuleType, number> = {
      [RuleType.SET_VALUE]: 1,
      [RuleType.REQUIRED]: 2,
      [RuleType.VISIBILITY]: 3,
    };

    return [...rules].sort((a, b) => 
      (priority[a.ruleType] || 99) - (priority[b.ruleType] || 99)
    );
  }

  /**
   * 评估条件（单条件，无嵌套）
   */
  private evaluateCondition(rule: RuleSchema, context: RuleContext): boolean {
    const { condition } = rule;
    const { formData, fieldIdToKey } = context;

    // 获取源字段的值
    const sourceKey = fieldIdToKey.get(condition.sourceField) || condition.sourceField;
    const sourceValue = this.getFieldValue(sourceKey, formData);

    // 执行比较
    return this.compare(sourceValue, condition.operator, condition.value);
  }

  /**
   * 获取字段值（支持嵌套路径）
   */
  private getFieldValue(fieldPath: string, formData: FormData): unknown {
    // 简单字段
    if (!fieldPath.includes('.')) {
      return formData[fieldPath];
    }

    // 嵌套路径 (如 subTable.fieldKey)
    const parts = fieldPath.split('.');
    let value: unknown = formData;

    for (const part of parts) {
      if (value === null || value === undefined) return undefined;
      
      // 处理数组索引 (如 items[0].name)
      const arrayMatch = part.match(/^(\w+)\[(\d+)\]$/);
      if (arrayMatch) {
        const [, key, index] = arrayMatch;
        value = (value as Record<string, unknown>)[key];
        if (Array.isArray(value)) {
          value = value[parseInt(index, 10)];
        }
      } else {
        value = (value as Record<string, unknown>)[part];
      }
    }

    return value;
  }

  /**
   * 比较操作
   */
  private compare(sourceValue: unknown, operator: CompareOperator, targetValue: unknown): boolean {
    switch (operator) {
      case CompareOperator.EQUALS:
        return this.equals(sourceValue, targetValue);
      
      case CompareOperator.NOT_EQUALS:
        return !this.equals(sourceValue, targetValue);
      
      case CompareOperator.GREATER_THAN:
        return Number(sourceValue) > Number(targetValue);
      
      case CompareOperator.LESS_THAN:
        return Number(sourceValue) < Number(targetValue);
      
      case CompareOperator.CONTAINS:
        return this.contains(sourceValue, targetValue);
      
      case CompareOperator.IS_EMPTY:
        return this.isEmpty(sourceValue);
      
      case CompareOperator.IS_NOT_EMPTY:
        return !this.isEmpty(sourceValue);
      
      default:
        console.warn(`未知操作符: ${operator}`);
        return false;
    }
  }

  /**
   * 相等判断
   */
  private equals(a: unknown, b: unknown): boolean {
    // 处理数组（多选值）
    if (Array.isArray(a) && !Array.isArray(b)) {
      return a.includes(b);
    }
    if (!Array.isArray(a) && Array.isArray(b)) {
      return b.includes(a);
    }
    if (Array.isArray(a) && Array.isArray(b)) {
      return JSON.stringify(a.sort()) === JSON.stringify(b.sort());
    }
    
    // 类型转换后比较
    return String(a) === String(b);
  }

  /**
   * 包含判断
   */
  private contains(source: unknown, target: unknown): boolean {
    if (Array.isArray(source)) {
      return source.includes(target);
    }
    if (typeof source === 'string') {
      return source.includes(String(target));
    }
    return false;
  }

  /**
   * 空值判断
   */
  private isEmpty(value: unknown): boolean {
    if (value === null || value === undefined) return true;
    if (value === '') return true;
    if (Array.isArray(value) && value.length === 0) return true;
    return false;
  }

  /**
   * 应用规则动作
   */
  private applyAction(rule: RuleSchema, result: RuleEvaluationResult): void {
    const { action, ruleType } = rule;

    switch (ruleType) {
      case RuleType.VISIBILITY:
        result.visibility.set(action.targetField, Boolean(action.actionValue));
        break;
      
      case RuleType.REQUIRED:
        result.required.set(action.targetField, Boolean(action.actionValue));
        break;
      
      case RuleType.SET_VALUE:
        result.setValue.set(action.targetField, action.actionValue);
        break;
    }
  }

  /**
   * 获取字段的有效可见性
   */
  getFieldVisibility(
    fieldId: string, 
    ruleResult: RuleEvaluationResult, 
    defaultVisible: boolean = true
  ): boolean {
    return ruleResult.visibility.has(fieldId) 
      ? ruleResult.visibility.get(fieldId)! 
      : defaultVisible;
  }

  /**
   * 获取字段的有效必填性
   */
  getFieldRequired(
    fieldId: string, 
    ruleResult: RuleEvaluationResult, 
    defaultRequired: boolean = false
  ): boolean {
    return ruleResult.required.has(fieldId) 
      ? ruleResult.required.get(fieldId)! 
      : defaultRequired;
  }
}

// ============ 规则验证器 ============
export class RuleValidator {
  
  /**
   * 验证规则配置
   */
  validate(rule: RuleSchema): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // 基础检查
    if (!rule.ruleId) {
      errors.push('规则 ID 不能为空');
    }
    if (!rule.ruleName) {
      errors.push('规则名称不能为空');
    }

    // 条件检查
    if (!rule.condition) {
      errors.push('规则条件不能为空');
    } else {
      if (!rule.condition.sourceField) {
        errors.push('触发字段不能为空');
      }
      if (!rule.condition.operator) {
        errors.push('比较操作符不能为空');
      }
      // value 可以为空（用于 isEmpty 等操作符）
    }

    // 动作检查
    if (!rule.action) {
      errors.push('规则动作不能为空');
    } else {
      if (!rule.action.targetField) {
        errors.push('目标字段不能为空');
      }
    }

    // 严格限制检查
    this.checkStrictLimits(rule, errors);

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * 检查严格限制（红线）
   */
  private checkStrictLimits(rule: RuleSchema, errors: string[]): void {
    // ❌ 禁止：嵌套条件
    if ((rule.condition as any).and || (rule.condition as any).or) {
      errors.push('不支持嵌套条件（and/or）');
    }

    // ❌ 禁止：多条件数组
    if (Array.isArray(rule.condition)) {
      errors.push('不支持多条件组合，请拆分为多个规则');
    }

    // ❌ 禁止：多目标数组
    if (Array.isArray(rule.action)) {
      errors.push('不支持多目标动作，请拆分为多个规则');
    }

    // ❌ 禁止：脚本表达式
    const conditionValue = rule.condition?.value;
    if (typeof conditionValue === 'string' && 
        (conditionValue.includes('${') || conditionValue.includes('function'))) {
      errors.push('不支持脚本表达式');
    }

    const actionValue = rule.action?.actionValue;
    if (typeof actionValue === 'string' && 
        (actionValue.includes('${') || actionValue.includes('function'))) {
      errors.push('不支持脚本表达式');
    }
  }
}

// ============ 规则模板 ============
export interface RuleTemplate {
  id: string;
  name: string;
  description: string;
  ruleType: RuleType;
  defaultOperator: CompareOperator;
  defaultActionValue: unknown;
}

export const RULE_TEMPLATES: RuleTemplate[] = [
  {
    id: 'show_when_equals',
    name: '条件显示',
    description: '当某字段等于指定值时，显示目标字段',
    ruleType: RuleType.VISIBILITY,
    defaultOperator: CompareOperator.EQUALS,
    defaultActionValue: true,
  },
  {
    id: 'hide_when_equals',
    name: '条件隐藏',
    description: '当某字段等于指定值时，隐藏目标字段',
    ruleType: RuleType.VISIBILITY,
    defaultOperator: CompareOperator.EQUALS,
    defaultActionValue: false,
  },
  {
    id: 'required_when_greater',
    name: '条件必填',
    description: '当某字段大于指定值时，目标字段必填',
    ruleType: RuleType.REQUIRED,
    defaultOperator: CompareOperator.GREATER_THAN,
    defaultActionValue: true,
  },
  {
    id: 'required_when_equals',
    name: '选项必填',
    description: '当某字段等于指定值时，目标字段必填',
    ruleType: RuleType.REQUIRED,
    defaultOperator: CompareOperator.EQUALS,
    defaultActionValue: true,
  },
  {
    id: 'set_value_when_equals',
    name: '条件赋值',
    description: '当某字段等于指定值时，为目标字段赋值',
    ruleType: RuleType.SET_VALUE,
    defaultOperator: CompareOperator.EQUALS,
    defaultActionValue: '',
  },
  {
    id: 'clear_when_empty',
    name: '清空联动',
    description: '当某字段为空时，清空目标字段',
    ruleType: RuleType.SET_VALUE,
    defaultOperator: CompareOperator.IS_EMPTY,
    defaultActionValue: '',
  },
];

// ============ 导出单例 ============
export const ruleEngine = new RuleEngineLite();
export const ruleValidator = new RuleValidator();
