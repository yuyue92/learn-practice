/**
 * 字段注册表系统
 * 可扩展的字段类型管理
 */

import { FieldType, FieldSchema, ValidationRule } from '../schema/types';

// ============ 字段分类 ============
export type FieldCategory = 'basic' | 'choice' | 'structure' | 'logic';

// ============ 字段渲染 Props ============
export interface FieldRenderProps {
  field: FieldSchema;
  value: unknown;
  onChange: (value: unknown) => void;
  disabled?: boolean;
  error?: string;
}

// ============ 字段配置 Props ============
export interface FieldConfigProps {
  field: FieldSchema;
  onChange: (field: FieldSchema) => void;
}

// ============ 验证结果 ============
export interface FieldValidationResult {
  valid: boolean;
  message?: string;
}

// ============ 字段定义接口 ============
export interface FieldDefinition {
  type: FieldType;
  category: FieldCategory;
  label: string;
  icon: string;
  description: string;
  
  // 验证函数
  validate: (value: unknown, schema: FieldSchema) => FieldValidationResult;
  
  // 默认值
  getDefaultValue: () => unknown;
  
  // 是否可在子表内使用
  allowInSubTable: boolean;
}

// ============ 字段注册表 ============
class FieldRegistry {
  private registry: Map<FieldType, FieldDefinition> = new Map();

  // 注册字段类型
  register(definition: FieldDefinition): void {
    this.registry.set(definition.type, definition);
  }

  // 获取字段定义
  get(type: FieldType): FieldDefinition | undefined {
    return this.registry.get(type);
  }

  // 获取所有字段定义
  getAll(): FieldDefinition[] {
    return Array.from(this.registry.values());
  }

  // 按分类获取字段
  getByCategory(category: FieldCategory): FieldDefinition[] {
    return this.getAll().filter((def) => def.category === category);
  }

  // 获取可在子表内使用的字段
  getSubTableFields(): FieldDefinition[] {
    return this.getAll().filter((def) => def.allowInSubTable);
  }

  // 检查类型是否已注册
  has(type: FieldType): boolean {
    return this.registry.has(type);
  }
}

// ============ 单例实例 ============
export const fieldRegistry = new FieldRegistry();

// ============ 通用验证函数 ============
function validateRequired(value: unknown, required: boolean): FieldValidationResult {
  if (!required) return { valid: true };
  
  if (value === null || value === undefined || value === '') {
    return { valid: false, message: '此字段为必填项' };
  }
  
  if (Array.isArray(value) && value.length === 0) {
    return { valid: false, message: '请至少选择一项' };
  }
  
  return { valid: true };
}

function validateText(value: unknown, validation?: ValidationRule): FieldValidationResult {
  if (typeof value !== 'string') return { valid: true };
  
  if (validation?.maxLength && value.length > validation.maxLength) {
    return { valid: false, message: `最多输入 ${validation.maxLength} 个字符` };
  }
  
  if (validation?.minLength && value.length < validation.minLength) {
    return { valid: false, message: `最少输入 ${validation.minLength} 个字符` };
  }
  
  if (validation?.pattern) {
    const regex = new RegExp(validation.pattern);
    if (!regex.test(value)) {
      return { valid: false, message: validation.message || '格式不正确' };
    }
  }
  
  return { valid: true };
}

function validateNumber(value: unknown, validation?: ValidationRule): FieldValidationResult {
  if (value === null || value === undefined || value === '') return { valid: true };
  
  const num = Number(value);
  if (isNaN(num)) {
    return { valid: false, message: '请输入有效数字' };
  }
  
  if (validation?.max !== undefined && num > validation.max) {
    return { valid: false, message: `数值不能大于 ${validation.max}` };
  }
  
  if (validation?.min !== undefined && num < validation.min) {
    return { valid: false, message: `数值不能小于 ${validation.min}` };
  }
  
  return { valid: true };
}

// ============ 注册内置字段类型 ============

// 文本字段
fieldRegistry.register({
  type: FieldType.TEXT,
  category: 'basic',
  label: '单行文本',
  icon: '📝',
  description: '用于输入单行文本内容',
  allowInSubTable: true,
  getDefaultValue: () => '',
  validate: (value, schema) => {
    const requiredResult = validateRequired(value, schema.dataSchema.required);
    if (!requiredResult.valid) return requiredResult;
    return validateText(value, schema.dataSchema.validation);
  },
});

// 数字字段
fieldRegistry.register({
  type: FieldType.NUMBER,
  category: 'basic',
  label: '数字',
  icon: '🔢',
  description: '用于输入数字',
  allowInSubTable: true,
  getDefaultValue: () => null,
  validate: (value, schema) => {
    const requiredResult = validateRequired(value, schema.dataSchema.required);
    if (!requiredResult.valid) return requiredResult;
    return validateNumber(value, schema.dataSchema.validation);
  },
});

// 日期字段
fieldRegistry.register({
  type: FieldType.DATE,
  category: 'basic',
  label: '日期',
  icon: '📅',
  description: '用于选择日期',
  allowInSubTable: true,
  getDefaultValue: () => null,
  validate: (value, schema) => {
    return validateRequired(value, schema.dataSchema.required);
  },
});

// 单选字段
fieldRegistry.register({
  type: FieldType.RADIO,
  category: 'choice',
  label: '单选',
  icon: '⭕',
  description: '从多个选项中选择一个',
  allowInSubTable: true,
  getDefaultValue: () => null,
  validate: (value, schema) => {
    return validateRequired(value, schema.dataSchema.required);
  },
});

// 多选字段
fieldRegistry.register({
  type: FieldType.CHECKBOX,
  category: 'choice',
  label: '多选',
  icon: '☑️',
  description: '从多个选项中选择多个',
  allowInSubTable: true,
  getDefaultValue: () => [],
  validate: (value, schema) => {
    return validateRequired(value, schema.dataSchema.required);
  },
});

// 子表字段
fieldRegistry.register({
  type: FieldType.SUB_TABLE,
  category: 'structure',
  label: '子表',
  icon: '📋',
  description: '用于录入多行明细数据',
  allowInSubTable: false, // 子表内不能嵌套子表
  getDefaultValue: () => [],
  validate: (value, schema) => {
    if (!schema.dataSchema.required) return { valid: true };
    
    if (!Array.isArray(value) || value.length === 0) {
      return { valid: false, message: '请至少添加一条记录' };
    }
    
    return { valid: true };
  },
});

// 计算字段
fieldRegistry.register({
  type: FieldType.COMPUTED,
  category: 'logic',
  label: '计算字段',
  icon: '🧮',
  description: '根据其他字段自动计算',
  allowInSubTable: false, // 计算字段不能在子表内
  getDefaultValue: () => 0,
  validate: () => ({ valid: true }), // 计算字段无需验证
});

// ============ 字段分类配置 ============
export const FIELD_CATEGORIES: Record<FieldCategory, { label: string; icon: string }> = {
  basic: { label: '基础字段', icon: '📝' },
  choice: { label: '选择字段', icon: '📋' },
  structure: { label: '结构字段', icon: '🗂️' },
  logic: { label: '逻辑字段', icon: '⚙️' },
};

// ============ 获取字段分类列表 ============
export function getFieldsByCategory(): Record<FieldCategory, FieldDefinition[]> {
  return {
    basic: fieldRegistry.getByCategory('basic'),
    choice: fieldRegistry.getByCategory('choice'),
    structure: fieldRegistry.getByCategory('structure'),
    logic: fieldRegistry.getByCategory('logic'),
  };
}
