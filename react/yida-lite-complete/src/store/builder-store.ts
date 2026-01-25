/**
 * 全局状态管理
 * 使用 Zustand 风格的简化实现
 */

import {
  FormSchema,
  FieldSchema,
  RuleSchema,
  FieldType,
  FormData,
} from '../schema/types';
import {
  createEmptyFormSchema,
  createFieldSchema,
  getAllFieldKeys,
  findFieldById,
  updateField,
  deleteField,
  insertField,
  moveField,
  cloneSchema,
  generateUUID,
} from '../schema/utils';
import { schemaValidator, ValidationResult } from '../schema/validator';

// ============ Builder 状态 ============
export interface BuilderState {
  // Schema 数据
  schema: FormSchema;
  
  // UI 状态
  selectedFieldId: string | null;
  draggedFieldType: FieldType | null;
  isDragging: boolean;
  
  // 历史记录
  history: FormSchema[];
  historyIndex: number;
  
  // 验证结果
  validationResult: ValidationResult | null;
}

// ============ Builder Actions ============
export interface BuilderActions {
  // Schema 操作
  setSchema: (schema: FormSchema) => void;
  updateFormName: (name: string) => void;
  
  // 字段操作
  addField: (type: FieldType, targetId?: string | null, position?: 'before' | 'after' | 'inside') => void;
  updateFieldConfig: (fieldId: string, updates: Partial<FieldSchema>) => void;
  deleteFieldById: (fieldId: string) => void;
  moveFieldTo: (sourceId: string, targetId: string, position: 'before' | 'after') => void;
  
  // 子表字段操作
  addSubTableField: (subTableId: string, type: FieldType) => void;
  
  // 规则操作
  addRule: (rule: Omit<RuleSchema, 'ruleId'>) => void;
  updateRule: (ruleId: string, updates: Partial<RuleSchema>) => void;
  deleteRule: (ruleId: string) => void;
  
  // UI 状态
  selectField: (fieldId: string | null) => void;
  setDraggedFieldType: (type: FieldType | null) => void;
  setIsDragging: (isDragging: boolean) => void;
  
  // 历史操作
  undo: () => void;
  redo: () => void;
  
  // 验证
  validate: () => ValidationResult;
  
  // 重置
  reset: () => void;
}

// ============ 初始状态 ============
const initialState: BuilderState = {
  schema: createEmptyFormSchema(),
  selectedFieldId: null,
  draggedFieldType: null,
  isDragging: false,
  history: [],
  historyIndex: -1,
  validationResult: null,
};

// ============ 创建 Store ============
type Listener = () => void;

class BuilderStore {
  private state: BuilderState;
  private listeners: Set<Listener> = new Set();

  constructor() {
    this.state = { ...initialState };
  }

  // 获取状态
  getState(): BuilderState {
    return this.state;
  }

  // 订阅变化
  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // 通知变化
  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }

  // 更新状态
  private setState(partial: Partial<BuilderState>): void {
    this.state = { ...this.state, ...partial };
    this.notify();
  }

  // 保存历史
  private saveHistory(): void {
    const newHistory = this.state.history.slice(0, this.state.historyIndex + 1);
    newHistory.push(cloneSchema(this.state.schema));
    
    // 限制历史记录数量
    if (newHistory.length > 50) {
      newHistory.shift();
    }
    
    this.setState({
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  }

  // ============ Actions ============

  setSchema = (schema: FormSchema): void => {
    this.saveHistory();
    this.setState({ schema: cloneSchema(schema) });
  };

  updateFormName = (name: string): void => {
    this.setState({
      schema: { ...this.state.schema, formName: name },
    });
  };

  addField = (
    type: FieldType,
    targetId: string | null = null,
    position: 'before' | 'after' | 'inside' = 'after'
  ): void => {
    this.saveHistory();
    
    const existingKeys = getAllFieldKeys(this.state.schema.fields);
    const newField = createFieldSchema(type, existingKeys);
    
    const updatedFields = insertField(
      this.state.schema.fields,
      newField,
      targetId,
      position
    );
    
    this.setState({
      schema: { ...this.state.schema, fields: updatedFields },
      selectedFieldId: newField.fieldId,
    });
  };

  updateFieldConfig = (fieldId: string, updates: Partial<FieldSchema>): void => {
    this.saveHistory();
    
    const updatedFields = updateField(
      this.state.schema.fields,
      fieldId,
      updates
    );
    
    this.setState({
      schema: { ...this.state.schema, fields: updatedFields },
    });
  };

  deleteFieldById = (fieldId: string): void => {
    this.saveHistory();
    
    const updatedFields = deleteField(this.state.schema.fields, fieldId);
    
    // 同时删除相关规则
    const updatedRules = this.state.schema.rules.filter(
      (rule) =>
        rule.condition.sourceField !== fieldId &&
        rule.action.targetField !== fieldId
    );
    
    this.setState({
      schema: {
        ...this.state.schema,
        fields: updatedFields,
        rules: updatedRules,
      },
      selectedFieldId:
        this.state.selectedFieldId === fieldId
          ? null
          : this.state.selectedFieldId,
    });
  };

  moveFieldTo = (
    sourceId: string,
    targetId: string,
    position: 'before' | 'after'
  ): void => {
    this.saveHistory();
    
    const updatedFields = moveField(
      this.state.schema.fields,
      sourceId,
      targetId,
      position
    );
    
    this.setState({
      schema: { ...this.state.schema, fields: updatedFields },
    });
  };

  addSubTableField = (subTableId: string, type: FieldType): void => {
    this.saveHistory();
    
    const subTable = findFieldById(this.state.schema.fields, subTableId);
    if (!subTable || subTable.fieldType !== FieldType.SUB_TABLE) return;
    
    const existingKeys = getAllFieldKeys(this.state.schema.fields);
    const newField = createFieldSchema(type, existingKeys);
    
    const updatedFields = updateField(this.state.schema.fields, subTableId, {
      children: [...(subTable.children || []), newField],
    });
    
    this.setState({
      schema: { ...this.state.schema, fields: updatedFields },
      selectedFieldId: newField.fieldId,
    });
  };

  addRule = (rule: Omit<RuleSchema, 'ruleId'>): void => {
    this.saveHistory();
    
    const newRule: RuleSchema = {
      ...rule,
      ruleId: generateUUID(),
    };
    
    this.setState({
      schema: {
        ...this.state.schema,
        rules: [...this.state.schema.rules, newRule],
      },
    });
  };

  updateRule = (ruleId: string, updates: Partial<RuleSchema>): void => {
    this.saveHistory();
    
    const updatedRules = this.state.schema.rules.map((rule) =>
      rule.ruleId === ruleId ? { ...rule, ...updates } : rule
    );
    
    this.setState({
      schema: { ...this.state.schema, rules: updatedRules },
    });
  };

  deleteRule = (ruleId: string): void => {
    this.saveHistory();
    
    const updatedRules = this.state.schema.rules.filter(
      (rule) => rule.ruleId !== ruleId
    );
    
    this.setState({
      schema: { ...this.state.schema, rules: updatedRules },
    });
  };

  selectField = (fieldId: string | null): void => {
    this.setState({ selectedFieldId: fieldId });
  };

  setDraggedFieldType = (type: FieldType | null): void => {
    this.setState({ draggedFieldType: type });
  };

  setIsDragging = (isDragging: boolean): void => {
    this.setState({ isDragging });
  };

  undo = (): void => {
    if (this.state.historyIndex > 0) {
      const newIndex = this.state.historyIndex - 1;
      this.setState({
        schema: cloneSchema(this.state.history[newIndex]),
        historyIndex: newIndex,
      });
    }
  };

  redo = (): void => {
    if (this.state.historyIndex < this.state.history.length - 1) {
      const newIndex = this.state.historyIndex + 1;
      this.setState({
        schema: cloneSchema(this.state.history[newIndex]),
        historyIndex: newIndex,
      });
    }
  };

  validate = (): ValidationResult => {
    const result = schemaValidator.validate(this.state.schema);
    this.setState({ validationResult: result });
    return result;
  };

  reset = (): void => {
    this.setState({
      ...initialState,
      schema: createEmptyFormSchema(),
    });
  };
}

// ============ 导出单例 ============
export const builderStore = new BuilderStore();

// ============ React Hook ============
export function useBuilderStore<T>(selector: (state: BuilderState) => T): T {
  // 这是一个简化实现，实际项目中应使用 useSyncExternalStore
  const [, forceUpdate] = React.useState({});
  
  React.useEffect(() => {
    return builderStore.subscribe(() => forceUpdate({}));
  }, []);
  
  return selector(builderStore.getState());
}

// 为了在非 React 环境中使用
import React from 'react';
