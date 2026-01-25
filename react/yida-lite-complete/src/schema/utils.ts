/**
 * Schema 工具函数
 */

import { 
  FormSchema, 
  FieldSchema, 
  FieldType,
  DataSchema,
  UISchema,
} from './types';

// ============ UUID 生成 ============
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ============ 字段 Key 生成 ============
export function generateFieldKey(type: FieldType, existingKeys: string[]): string {
  const prefix = type.toLowerCase();
  let index = 1;
  let key = `${prefix}_${index}`;
  
  while (existingKeys.includes(key)) {
    index++;
    key = `${prefix}_${index}`;
  }
  
  return key;
}

// ============ 获取所有字段 Keys ============
export function getAllFieldKeys(fields: FieldSchema[]): string[] {
  const keys: string[] = [];
  
  const traverse = (fieldList: FieldSchema[]) => {
    for (const field of fieldList) {
      keys.push(field.fieldKey);
      if (field.children) {
        traverse(field.children);
      }
    }
  };
  
  traverse(fields);
  return keys;
}

// ============ 创建空表单 Schema ============
export function createEmptyFormSchema(name: string = '未命名表单'): FormSchema {
  return {
    formId: generateUUID(),
    formName: name,
    schemaVersion: 1,
    fields: [],
    rules: [],
  };
}

// ============ 创建字段 Schema ============
export function createFieldSchema(
  type: FieldType,
  existingKeys: string[],
  overrides?: Partial<FieldSchema>
): FieldSchema {
  const fieldId = generateUUID();
  const fieldKey = generateFieldKey(type, existingKeys);
  
  const defaultLabels: Record<FieldType, string> = {
    [FieldType.TEXT]: '单行文本',
    [FieldType.NUMBER]: '数字',
    [FieldType.DATE]: '日期',
    [FieldType.RADIO]: '单选',
    [FieldType.CHECKBOX]: '多选',
    [FieldType.SUB_TABLE]: '子表',
    [FieldType.COMPUTED]: '计算字段',
  };

  const defaultDataSchema: DataSchema = {
    required: false,
  };

  const defaultUISchema: UISchema = {
    width: 'full',
    visible: true,
  };

  // 特殊类型的默认配置
  if (type === FieldType.RADIO || type === FieldType.CHECKBOX) {
    defaultDataSchema.options = [
      { value: 'option1', label: '选项1' },
      { value: 'option2', label: '选项2' },
    ];
  }

  const baseSchema: FieldSchema = {
    fieldId,
    fieldKey,
    fieldType: type,
    label: defaultLabels[type],
    dataSchema: defaultDataSchema,
    uiSchema: defaultUISchema,
  };

  // 子表需要初始化 children
  if (type === FieldType.SUB_TABLE) {
    baseSchema.children = [];
  }

  // 计算字段需要初始化 computation
  if (type === FieldType.COMPUTED) {
    baseSchema.computation = {
      function: 'SUM' as const,
      sourceField: '',
      precision: 2,
    };
  }

  return { ...baseSchema, ...overrides };
}

// ============ 查找字段 ============
export function findFieldById(
  fields: FieldSchema[],
  fieldId: string
): FieldSchema | null {
  for (const field of fields) {
    if (field.fieldId === fieldId) {
      return field;
    }
    if (field.children) {
      const found = findFieldById(field.children, fieldId);
      if (found) return found;
    }
  }
  return null;
}

// ============ 查找字段路径 ============
export function findFieldPath(
  fields: FieldSchema[],
  fieldId: string,
  path: number[] = []
): number[] | null {
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    if (field.fieldId === fieldId) {
      return [...path, i];
    }
    if (field.children) {
      const found = findFieldPath(field.children, fieldId, [...path, i]);
      if (found) return found;
    }
  }
  return null;
}

// ============ 更新字段 ============
export function updateField(
  fields: FieldSchema[],
  fieldId: string,
  updates: Partial<FieldSchema>
): FieldSchema[] {
  return fields.map((field) => {
    if (field.fieldId === fieldId) {
      return { ...field, ...updates };
    }
    if (field.children) {
      return {
        ...field,
        children: updateField(field.children, fieldId, updates),
      };
    }
    return field;
  });
}

// ============ 删除字段 ============
export function deleteField(
  fields: FieldSchema[],
  fieldId: string
): FieldSchema[] {
  return fields
    .filter((field) => field.fieldId !== fieldId)
    .map((field) => {
      if (field.children) {
        return {
          ...field,
          children: deleteField(field.children, fieldId),
        };
      }
      return field;
    });
}

// ============ 插入字段 ============
export function insertField(
  fields: FieldSchema[],
  newField: FieldSchema,
  targetId: string | null,
  position: 'before' | 'after' | 'inside' = 'after'
): FieldSchema[] {
  // 如果没有目标，添加到末尾
  if (!targetId) {
    return [...fields, newField];
  }

  const result: FieldSchema[] = [];

  for (const field of fields) {
    if (field.fieldId === targetId) {
      if (position === 'before') {
        result.push(newField, field);
      } else if (position === 'after') {
        result.push(field, newField);
      } else if (position === 'inside' && field.children !== undefined) {
        result.push({
          ...field,
          children: [...field.children, newField],
        });
      } else {
        result.push(field, newField);
      }
    } else if (field.children) {
      result.push({
        ...field,
        children: insertField(field.children, newField, targetId, position),
      });
    } else {
      result.push(field);
    }
  }

  return result;
}

// ============ 移动字段 ============
export function moveField(
  fields: FieldSchema[],
  sourceId: string,
  targetId: string,
  position: 'before' | 'after'
): FieldSchema[] {
  const sourceField = findFieldById(fields, sourceId);
  if (!sourceField) return fields;

  // 先删除源字段
  const withoutSource = deleteField(fields, sourceId);
  
  // 再插入到目标位置
  return insertField(withoutSource, sourceField, targetId, position);
}

// ============ 克隆 Schema (深拷贝) ============
export function cloneSchema<T>(schema: T): T {
  return JSON.parse(JSON.stringify(schema));
}
