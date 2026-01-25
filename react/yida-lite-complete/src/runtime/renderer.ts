/**
 * Runtime Renderer
 * Schema 驱动的表单渲染器
 */

import {
  FormSchema,
  FieldSchema,
  FieldType,
  FormData,
} from '../schema/types';

// ============ 渲染节点 ============
export interface RenderNode {
  fieldId: string;
  fieldKey: string;
  fieldType: FieldType;
  label: string;
  props: RenderProps;
  children?: RenderNode[];
}

// ============ 渲染 Props ============
export interface RenderProps {
  required: boolean;
  placeholder?: string;
  helpText?: string;
  width: 'full' | 'half' | 'third';
  visible: boolean;
  disabled?: boolean;
  options?: Array<{ value: string; label: string }>;
  computation?: {
    function: string;
    sourceField: string;
    precision?: number;
  };
}

// ============ 编译后的表单 ============
export interface CompiledForm {
  formId: string;
  formName: string;
  version: number;
  renderTree: RenderNode[];
  fieldMap: Map<string, FieldSchema>;
  fieldKeyMap: Map<string, FieldSchema>;
}

// ============ Schema 编译器 ============
export class SchemaCompiler {
  compile(schema: FormSchema): CompiledForm {
    return {
      formId: schema.formId,
      formName: schema.formName,
      version: schema.schemaVersion,
      renderTree: this.buildRenderTree(schema.fields),
      fieldMap: this.buildFieldMap(schema.fields),
      fieldKeyMap: this.buildFieldKeyMap(schema.fields),
    };
  }

  private buildRenderTree(fields: FieldSchema[]): RenderNode[] {
    return fields.map((field) => ({
      fieldId: field.fieldId,
      fieldKey: field.fieldKey,
      fieldType: field.fieldType,
      label: field.label,
      props: this.extractRenderProps(field),
      children: field.children
        ? this.buildRenderTree(field.children)
        : undefined,
    }));
  }

  private extractRenderProps(field: FieldSchema): RenderProps {
    return {
      required: field.dataSchema.required,
      placeholder: field.uiSchema.placeholder,
      helpText: field.uiSchema.helpText,
      width: field.uiSchema.width || 'full',
      visible: field.uiSchema.visible !== false,
      options: field.dataSchema.options,
      computation: field.computation,
    };
  }

  private buildFieldMap(fields: FieldSchema[]): Map<string, FieldSchema> {
    const map = new Map<string, FieldSchema>();
    
    const traverse = (fieldList: FieldSchema[]) => {
      for (const field of fieldList) {
        map.set(field.fieldId, field);
        if (field.children) {
          traverse(field.children);
        }
      }
    };
    
    traverse(fields);
    return map;
  }

  private buildFieldKeyMap(fields: FieldSchema[]): Map<string, FieldSchema> {
    const map = new Map<string, FieldSchema>();
    
    const traverse = (fieldList: FieldSchema[]) => {
      for (const field of fieldList) {
        map.set(field.fieldKey, field);
        if (field.children) {
          traverse(field.children);
        }
      }
    };
    
    traverse(fields);
    return map;
  }
}

// ============ 渲染上下文 ============
export interface RenderContext {
  formData: FormData;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  
  // 回调
  onChange: (fieldKey: string, value: unknown) => void;
  onBlur: (fieldKey: string) => void;
  
  // 子表回调
  onAddRow?: (fieldKey: string) => void;
  onDeleteRow?: (fieldKey: string, rowIndex: number) => void;
  onRowChange?: (fieldKey: string, rowIndex: number, columnKey: string, value: unknown) => void;
  
  // 状态覆盖（来自规则引擎）
  visibilityOverrides?: Map<string, boolean>;
  requiredOverrides?: Map<string, boolean>;
  valueOverrides?: Map<string, unknown>;
}

// ============ 单例编译器 ============
export const schemaCompiler = new SchemaCompiler();
