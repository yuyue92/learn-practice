/**
 * Schema Layer - 核心类型定义
 * 遵循五大 Schema 原则
 * 
 * Phase 2 增强：
 * - 规则系统类型
 * - 计算字段增强
 * - 列表视图配置
 */

// ============ 字段类型枚举 ============
export enum FieldType {
  TEXT = 'text',
  NUMBER = 'number',
  DATE = 'date',
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  SUB_TABLE = 'subTable',
  COMPUTED = 'computed',
  // Phase 2 预留
  TEXTAREA = 'textarea',
  SELECT = 'select',
}

// ============ 比较操作符 ============
export enum CompareOperator {
  EQUALS = 'eq',
  NOT_EQUALS = 'neq',
  GREATER_THAN = 'gt',
  LESS_THAN = 'lt',
  CONTAINS = 'contains',
  IS_EMPTY = 'isEmpty',
  IS_NOT_EMPTY = 'isNotEmpty',
}

// ============ 规则类型 ============
export enum RuleType {
  VISIBILITY = 'visibility',
  REQUIRED = 'required',
  SET_VALUE = 'setValue',
}

// ============ 计算函数 ============
export enum ComputeFunction {
  SUM = 'SUM',
  COUNT = 'COUNT',
  AVG = 'AVG',
}

// ============ 验证规则 ============
export interface ValidationRule {
  maxLength?: number;
  minLength?: number;
  max?: number;
  min?: number;
  pattern?: string;
  message?: string;
}

// ============ 选项配置 ============
export interface OptionItem {
  value: string;
  label: string;
}

// ============ 数据约束 ============
export interface DataSchema {
  required: boolean;
  defaultValue?: unknown;
  validation?: ValidationRule;
  options?: OptionItem[]; // 用于 radio/checkbox
}

// ============ UI 配置 ============
export interface UISchema {
  placeholder?: string;
  helpText?: string;
  width?: 'full' | 'half' | 'third';
  visible?: boolean;
}

// ============ 计算配置 ============
export interface ComputationConfig {
  function: ComputeFunction;
  sourceField: string; // 格式: subTableKey.fieldKey
  precision?: number;
}

// ============ 字段 Schema ============
export interface FieldSchema {
  fieldId: string;       // 永久 ID (UUID)
  fieldKey: string;      // 业务键名
  fieldType: FieldType;
  label: string;
  
  dataSchema: DataSchema;
  uiSchema: UISchema;
  
  // 子表专用
  children?: FieldSchema[];
  
  // 计算字段专用
  computation?: ComputationConfig;
}

// ============ 规则条件 ============
export interface RuleCondition {
  sourceField: string;   // 触发字段 ID
  operator: CompareOperator;
  value: unknown;
}

// ============ 规则动作 ============
export interface RuleAction {
  targetField: string;   // 作用字段 ID
  actionValue: unknown;
}

// ============ 规则 Schema ============
export interface RuleSchema {
  ruleId: string;
  ruleName: string;
  ruleType: RuleType;
  condition: RuleCondition;
  action: RuleAction;
}

// ============ 表单 Schema ============
export interface FormSchema {
  formId: string;
  formName: string;
  schemaVersion: number;
  fields: FieldSchema[];
  rules: RuleSchema[];
  
  // Phase 2: 列表视图配置
  listView?: ListViewConfig;
  
  // 预留位
  _reserved?: {
    fieldPermissions?: Record<string, string>;
    workflow?: string;
    pageLayout?: unknown;
  };
}

// ============ 列表视图配置 ============
export interface ListViewConfig {
  columns: ListColumn[];          // 显示列
  defaultSort?: {
    field: string;
    order: 'asc' | 'desc';
  };
  pageSize?: number;
  enableSearch?: boolean;
  searchFields?: string[];        // 可搜索字段
}

// ============ 列表列配置 ============
export interface ListColumn {
  fieldId: string;
  fieldKey: string;
  label: string;
  width?: number;
  sortable?: boolean;
  filterable?: boolean;
}

// ============ 表单数据 ============
export type FormData = Record<string, unknown>;

// ============ 字段状态 ============
export interface FieldState {
  visible: boolean;
  required: boolean;
  value: unknown;
  errors: string[];
}

// ============ 表单状态 ============
export type FormState = Record<string, FieldState>;
