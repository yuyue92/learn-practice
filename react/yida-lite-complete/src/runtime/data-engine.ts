/**
 * Runtime Data Engine
 * 表单运行时数据管理
 */

import {
  FormSchema,
  FieldSchema,
  FormData,
  FieldType,
} from '../schema/types';
import { fieldRegistry } from '../fields/registry';

// ============ 数据引擎状态 ============
export interface DataEngineState {
  formData: FormData;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

// ============ 数据引擎 ============
export class DataEngine {
  private schema: FormSchema;
  private state: DataEngineState;
  private listeners: Set<() => void> = new Set();

  constructor(schema: FormSchema, initialData?: FormData) {
    this.schema = schema;
    this.state = {
      formData: initialData || this.createInitialData(schema.fields),
      errors: {},
      touched: {},
    };
  }

  // ============ 创建初始数据 ============
  private createInitialData(fields: FieldSchema[]): FormData {
    const data: FormData = {};

    for (const field of fields) {
      const definition = fieldRegistry.get(field.fieldType);
      
      if (field.dataSchema.defaultValue !== undefined) {
        data[field.fieldKey] = field.dataSchema.defaultValue;
      } else if (definition) {
        data[field.fieldKey] = definition.getDefaultValue();
      } else {
        data[field.fieldKey] = null;
      }

      // 子表初始化
      if (field.fieldType === FieldType.SUB_TABLE) {
        data[field.fieldKey] = [];
      }
    }

    return data;
  }

  // ============ 获取状态 ============
  getState(): DataEngineState {
    return this.state;
  }

  // ============ 获取表单数据 ============
  getFormData(): FormData {
    return this.state.formData;
  }

  // ============ 获取字段值 ============
  getFieldValue(fieldKey: string): unknown {
    return this.state.formData[fieldKey];
  }

  // ============ 设置字段值 ============
  setFieldValue(fieldKey: string, value: unknown): void {
    this.state = {
      ...this.state,
      formData: {
        ...this.state.formData,
        [fieldKey]: value,
      },
      touched: {
        ...this.state.touched,
        [fieldKey]: true,
      },
    };
    
    // 验证字段
    this.validateField(fieldKey);
    
    this.notify();
  }

  // ============ 批量设置值 ============
  setValues(values: FormData): void {
    this.state = {
      ...this.state,
      formData: {
        ...this.state.formData,
        ...values,
      },
    };
    this.notify();
  }

  // ============ 子表操作 ============
  addSubTableRow(fieldKey: string, rowData?: Record<string, unknown>): void {
    const field = this.findFieldByKey(fieldKey);
    if (!field || field.fieldType !== FieldType.SUB_TABLE) return;

    const currentRows = (this.state.formData[fieldKey] as Array<Record<string, unknown>>) || [];
    const newRow = rowData || this.createSubTableRow(field);

    this.setFieldValue(fieldKey, [...currentRows, newRow]);
  }

  updateSubTableRow(
    fieldKey: string,
    rowIndex: number,
    columnKey: string,
    value: unknown
  ): void {
    const currentRows = (this.state.formData[fieldKey] as Array<Record<string, unknown>>) || [];
    
    if (rowIndex < 0 || rowIndex >= currentRows.length) return;

    const updatedRows = currentRows.map((row, index) =>
      index === rowIndex ? { ...row, [columnKey]: value } : row
    );

    this.setFieldValue(fieldKey, updatedRows);
  }

  deleteSubTableRow(fieldKey: string, rowIndex: number): void {
    const currentRows = (this.state.formData[fieldKey] as Array<Record<string, unknown>>) || [];
    
    if (rowIndex < 0 || rowIndex >= currentRows.length) return;

    const updatedRows = currentRows.filter((_, index) => index !== rowIndex);
    this.setFieldValue(fieldKey, updatedRows);
  }

  private createSubTableRow(field: FieldSchema): Record<string, unknown> {
    const row: Record<string, unknown> = {};
    
    for (const child of field.children || []) {
      const definition = fieldRegistry.get(child.fieldType);
      row[child.fieldKey] = definition?.getDefaultValue() ?? null;
    }
    
    return row;
  }

  // ============ 验证 ============
  validateField(fieldKey: string): boolean {
    const field = this.findFieldByKey(fieldKey);
    if (!field) return true;

    const definition = fieldRegistry.get(field.fieldType);
    if (!definition) return true;

    const value = this.state.formData[fieldKey];
    const result = definition.validate(value, field);

    if (!result.valid) {
      this.state.errors[fieldKey] = result.message || '验证失败';
    } else {
      delete this.state.errors[fieldKey];
    }

    return result.valid;
  }

  validateAll(): boolean {
    const errors: Record<string, string> = {};
    let isValid = true;

    const validateFields = (fields: FieldSchema[], prefix: string = '') => {
      for (const field of fields) {
        const key = prefix ? `${prefix}.${field.fieldKey}` : field.fieldKey;
        const definition = fieldRegistry.get(field.fieldType);
        
        if (definition) {
          const value = this.getNestedValue(key);
          const result = definition.validate(value, field);
          
          if (!result.valid) {
            errors[key] = result.message || '验证失败';
            isValid = false;
          }
        }

        // 子表验证
        if (field.fieldType === FieldType.SUB_TABLE && field.children) {
          const rows = this.state.formData[field.fieldKey] as Array<Record<string, unknown>>;
          
          if (Array.isArray(rows)) {
            rows.forEach((row, rowIndex) => {
              for (const child of field.children!) {
                const childDef = fieldRegistry.get(child.fieldType);
                if (childDef) {
                  const result = childDef.validate(row[child.fieldKey], child);
                  if (!result.valid) {
                    errors[`${field.fieldKey}[${rowIndex}].${child.fieldKey}`] = result.message || '验证失败';
                    isValid = false;
                  }
                }
              }
            });
          }
        }
      }
    };

    validateFields(this.schema.fields);
    
    this.state = { ...this.state, errors };
    this.notify();
    
    return isValid;
  }

  getErrors(): Record<string, string> {
    return this.state.errors;
  }

  getFieldError(fieldKey: string): string | undefined {
    return this.state.errors[fieldKey];
  }

  // ============ 重置 ============
  reset(): void {
    this.state = {
      formData: this.createInitialData(this.schema.fields),
      errors: {},
      touched: {},
    };
    this.notify();
  }

  // ============ 辅助方法 ============
  private findFieldByKey(fieldKey: string): FieldSchema | null {
    const search = (fields: FieldSchema[]): FieldSchema | null => {
      for (const field of fields) {
        if (field.fieldKey === fieldKey) return field;
        if (field.children) {
          const found = search(field.children);
          if (found) return found;
        }
      }
      return null;
    };
    return search(this.schema.fields);
  }

  private getNestedValue(path: string): unknown {
    const parts = path.split('.');
    let value: unknown = this.state.formData;
    
    for (const part of parts) {
      if (value === null || value === undefined) return undefined;
      value = (value as Record<string, unknown>)[part];
    }
    
    return value;
  }

  // ============ 订阅 ============
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }
}

// ============ 创建数据引擎 ============
export function createDataEngine(
  schema: FormSchema,
  initialData?: FormData
): DataEngine {
  return new DataEngine(schema, initialData);
}
