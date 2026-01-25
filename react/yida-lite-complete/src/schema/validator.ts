/**
 * Schema 验证器
 * 确保 Schema 符合设计约束
 */

import {
  FormSchema,
  FieldSchema,
  RuleSchema,
  FieldType,
} from './types';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// ============ 表单 Schema 验证器 ============
export class SchemaValidator {
  validate(schema: FormSchema): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // 基础检查
    if (!schema.formId) {
      errors.push('表单 ID 不能为空');
    }
    if (!schema.formName) {
      warnings.push('表单名称为空');
    }

    // 字段检查
    this.validateFields(schema.fields, errors, warnings);

    // 子表约束检查
    this.validateSubTableConstraints(schema.fields, errors);

    // 规则检查
    this.validateRules(schema.rules, schema.fields, errors, warnings);

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  // ============ 字段验证 ============
  private validateFields(
    fields: FieldSchema[],
    errors: string[],
    warnings: string[],
    depth: number = 0
  ): void {
    const fieldIds = new Set<string>();
    const fieldKeys = new Set<string>();

    for (const field of fields) {
      // ID 唯一性检查
      if (fieldIds.has(field.fieldId)) {
        errors.push(`字段 ID 重复: ${field.fieldId}`);
      }
      fieldIds.add(field.fieldId);

      // Key 唯一性检查
      if (fieldKeys.has(field.fieldKey)) {
        errors.push(`字段 Key 重复: ${field.fieldKey}`);
      }
      fieldKeys.add(field.fieldKey);

      // 必填字段检查
      if (!field.fieldId) {
        errors.push('存在字段缺少 fieldId');
      }
      if (!field.fieldKey) {
        errors.push(`字段 ${field.fieldId} 缺少 fieldKey`);
      }
      if (!field.fieldType) {
        errors.push(`字段 ${field.fieldId} 缺少 fieldType`);
      }

      // 子表嵌套深度检查
      if (field.fieldType === FieldType.SUB_TABLE) {
        if (depth > 0) {
          errors.push(`子表「${field.label}」不能嵌套在其他子表内`);
        }
        if (field.children) {
          this.validateFields(field.children, errors, warnings, depth + 1);
        }
      }

      // 计算字段配置检查
      if (field.fieldType === FieldType.COMPUTED) {
        if (!field.computation) {
          errors.push(`计算字段「${field.label}」缺少 computation 配置`);
        }
      }

      // 选择字段选项检查
      if (
        (field.fieldType === FieldType.RADIO ||
          field.fieldType === FieldType.CHECKBOX) &&
        (!field.dataSchema.options || field.dataSchema.options.length === 0)
      ) {
        warnings.push(`选择字段「${field.label}」没有配置选项`);
      }
    }
  }

  // ============ 子表约束验证 ============
  private validateSubTableConstraints(
    fields: FieldSchema[],
    errors: string[]
  ): void {
    for (const field of fields) {
      if (field.fieldType === FieldType.SUB_TABLE && field.children) {
        for (const child of field.children) {
          // 子表内不能有子表
          if (child.fieldType === FieldType.SUB_TABLE) {
            errors.push(`子表「${field.label}」内不能包含子表字段`);
          }
        }
      }
    }
  }

  // ============ 规则验证 ============
  private validateRules(
    rules: RuleSchema[],
    fields: FieldSchema[],
    errors: string[],
    warnings: string[]
  ): void {
    const fieldIdSet = this.collectFieldIds(fields);
    const subTableFieldIds = this.collectSubTableFieldIds(fields);
    const parentFieldIds = this.collectParentFieldIds(fields);

    for (const rule of rules) {
      // 基础检查
      if (!rule.ruleId) {
        errors.push('存在规则缺少 ruleId');
      }
      if (!rule.condition?.sourceField) {
        errors.push(`规则「${rule.ruleName}」缺少触发字段`);
      }
      if (!rule.action?.targetField) {
        errors.push(`规则「${rule.ruleName}」缺少目标字段`);
      }

      // 字段存在性检查
      if (rule.condition?.sourceField && !fieldIdSet.has(rule.condition.sourceField)) {
        errors.push(`规则「${rule.ruleName}」的触发字段不存在`);
      }
      if (rule.action?.targetField && !fieldIdSet.has(rule.action.targetField)) {
        errors.push(`规则「${rule.ruleName}」的目标字段不存在`);
      }

      // 子表字段不能被父表字段触发
      if (
        subTableFieldIds.has(rule.action?.targetField) &&
        parentFieldIds.has(rule.condition?.sourceField)
      ) {
        errors.push(`规则「${rule.ruleName}」：子表字段不能被父表字段触发`);
      }
    }
  }

  // ============ 辅助方法 ============
  private collectFieldIds(fields: FieldSchema[]): Set<string> {
    const ids = new Set<string>();
    const traverse = (fieldList: FieldSchema[]) => {
      for (const field of fieldList) {
        ids.add(field.fieldId);
        if (field.children) {
          traverse(field.children);
        }
      }
    };
    traverse(fields);
    return ids;
  }

  private collectSubTableFieldIds(fields: FieldSchema[]): Set<string> {
    const ids = new Set<string>();
    for (const field of fields) {
      if (field.fieldType === FieldType.SUB_TABLE && field.children) {
        for (const child of field.children) {
          ids.add(child.fieldId);
        }
      }
    }
    return ids;
  }

  private collectParentFieldIds(fields: FieldSchema[]): Set<string> {
    const ids = new Set<string>();
    for (const field of fields) {
      if (field.fieldType !== FieldType.SUB_TABLE) {
        ids.add(field.fieldId);
      }
    }
    return ids;
  }
}

// ============ 导出单例 ============
export const schemaValidator = new SchemaValidator();
