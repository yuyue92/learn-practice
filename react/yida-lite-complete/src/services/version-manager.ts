/**
 * Version Manager - 版本管理服务
 * Phase 3 Week 11: Schema 版本管理、历史记录、回滚
 * 
 * 功能：
 * - Schema 版本快照
 * - 版本历史浏览
 * - 版本对比
 * - 版本回滚
 * - 变更记录
 */

import { FormSchema, FieldSchema, RuleSchema } from '../schema/types';

// ============ 版本记录 ============
export interface SchemaVersion {
  versionId: string;
  formId: string;
  version: number;
  schema: FormSchema;
  
  // 元数据
  createdAt: Date;
  createdBy: string;
  comment?: string;
  
  // 变更摘要
  changes: VersionChange[];
}

// ============ 变更记录 ============
export interface VersionChange {
  type: 'add' | 'update' | 'delete';
  target: 'field' | 'rule' | 'form';
  targetId: string;
  targetName: string;
  details?: string;
  before?: unknown;
  after?: unknown;
}

// ============ 版本对比结果 ============
export interface VersionDiff {
  fromVersion: number;
  toVersion: number;
  changes: VersionChange[];
  summary: {
    added: number;
    updated: number;
    deleted: number;
  };
}

// ============ 版本管理器 ============
export class VersionManager {
  private versions: Map<string, SchemaVersion[]> = new Map();
  private maxVersions: number = 50; // 最多保留版本数

  /**
   * 保存新版本
   */
  save(
    schema: FormSchema,
    userId: string,
    comment?: string
  ): SchemaVersion {
    const formId = schema.formId;
    const versions = this.versions.get(formId) || [];
    
    // 获取上一个版本用于对比
    const prevVersion = versions[versions.length - 1];
    
    // 计算变更
    const changes = prevVersion
      ? this.calculateChanges(prevVersion.schema, schema)
      : this.getInitialChanges(schema);

    // 创建新版本
    const newVersion: SchemaVersion = {
      versionId: this.generateId(),
      formId,
      version: schema.schemaVersion,
      schema: this.deepClone(schema),
      createdAt: new Date(),
      createdBy: userId,
      comment,
      changes,
    };

    // 添加到版本列表
    versions.push(newVersion);

    // 限制版本数量
    if (versions.length > this.maxVersions) {
      versions.shift();
    }

    this.versions.set(formId, versions);
    return newVersion;
  }

  /**
   * 获取版本历史
   */
  getHistory(formId: string): SchemaVersion[] {
    return this.versions.get(formId) || [];
  }

  /**
   * 获取指定版本
   */
  getVersion(formId: string, version: number): SchemaVersion | null {
    const versions = this.versions.get(formId) || [];
    return versions.find(v => v.version === version) || null;
  }

  /**
   * 获取最新版本
   */
  getLatest(formId: string): SchemaVersion | null {
    const versions = this.versions.get(formId) || [];
    return versions[versions.length - 1] || null;
  }

  /**
   * 版本对比
   */
  compare(formId: string, fromVersion: number, toVersion: number): VersionDiff {
    const from = this.getVersion(formId, fromVersion);
    const to = this.getVersion(formId, toVersion);

    if (!from || !to) {
      throw new Error('版本不存在');
    }

    const changes = this.calculateChanges(from.schema, to.schema);
    
    return {
      fromVersion,
      toVersion,
      changes,
      summary: {
        added: changes.filter(c => c.type === 'add').length,
        updated: changes.filter(c => c.type === 'update').length,
        deleted: changes.filter(c => c.type === 'delete').length,
      },
    };
  }

  /**
   * 回滚到指定版本
   */
  rollback(formId: string, targetVersion: number, userId: string): FormSchema {
    const target = this.getVersion(formId, targetVersion);
    if (!target) {
      throw new Error(`版本 ${targetVersion} 不存在`);
    }

    const latest = this.getLatest(formId);
    const newVersionNumber = (latest?.version || 0) + 1;

    // 创建回滚后的 Schema
    const rolledBackSchema: FormSchema = {
      ...this.deepClone(target.schema),
      schemaVersion: newVersionNumber,
    };

    // 保存为新版本
    this.save(
      rolledBackSchema,
      userId,
      `回滚到版本 ${targetVersion}`
    );

    return rolledBackSchema;
  }

  /**
   * 计算两个 Schema 之间的变更
   */
  private calculateChanges(
    oldSchema: FormSchema,
    newSchema: FormSchema
  ): VersionChange[] {
    const changes: VersionChange[] = [];

    // 表单属性变更
    if (oldSchema.formName !== newSchema.formName) {
      changes.push({
        type: 'update',
        target: 'form',
        targetId: newSchema.formId,
        targetName: '表单名称',
        before: oldSchema.formName,
        after: newSchema.formName,
      });
    }

    // 字段变更
    changes.push(...this.compareFields(oldSchema.fields, newSchema.fields));

    // 规则变更
    changes.push(...this.compareRules(oldSchema.rules, newSchema.rules));

    return changes;
  }

  /**
   * 对比字段变更
   */
  private compareFields(
    oldFields: FieldSchema[],
    newFields: FieldSchema[]
  ): VersionChange[] {
    const changes: VersionChange[] = [];
    const oldMap = new Map(oldFields.map(f => [f.fieldId, f]));
    const newMap = new Map(newFields.map(f => [f.fieldId, f]));

    // 检查新增和更新
    for (const [id, newField] of newMap) {
      const oldField = oldMap.get(id);
      
      if (!oldField) {
        changes.push({
          type: 'add',
          target: 'field',
          targetId: id,
          targetName: newField.label,
          details: `添加${newField.fieldType}字段`,
          after: newField,
        });
      } else if (!this.deepEqual(oldField, newField)) {
        const details = this.getFieldChangeDetails(oldField, newField);
        changes.push({
          type: 'update',
          target: 'field',
          targetId: id,
          targetName: newField.label,
          details,
          before: oldField,
          after: newField,
        });
      }

      // 递归检查子字段
      if (oldField?.children && newField.children) {
        changes.push(...this.compareFields(oldField.children, newField.children));
      }
    }

    // 检查删除
    for (const [id, oldField] of oldMap) {
      if (!newMap.has(id)) {
        changes.push({
          type: 'delete',
          target: 'field',
          targetId: id,
          targetName: oldField.label,
          details: `删除${oldField.fieldType}字段`,
          before: oldField,
        });
      }
    }

    return changes;
  }

  /**
   * 对比规则变更
   */
  private compareRules(
    oldRules: RuleSchema[],
    newRules: RuleSchema[]
  ): VersionChange[] {
    const changes: VersionChange[] = [];
    const oldMap = new Map(oldRules.map(r => [r.ruleId, r]));
    const newMap = new Map(newRules.map(r => [r.ruleId, r]));

    // 检查新增和更新
    for (const [id, newRule] of newMap) {
      const oldRule = oldMap.get(id);
      
      if (!oldRule) {
        changes.push({
          type: 'add',
          target: 'rule',
          targetId: id,
          targetName: newRule.ruleName,
          details: `添加${newRule.ruleType}规则`,
          after: newRule,
        });
      } else if (!this.deepEqual(oldRule, newRule)) {
        changes.push({
          type: 'update',
          target: 'rule',
          targetId: id,
          targetName: newRule.ruleName,
          details: '修改规则配置',
          before: oldRule,
          after: newRule,
        });
      }
    }

    // 检查删除
    for (const [id, oldRule] of oldMap) {
      if (!newMap.has(id)) {
        changes.push({
          type: 'delete',
          target: 'rule',
          targetId: id,
          targetName: oldRule.ruleName,
          details: `删除${oldRule.ruleType}规则`,
          before: oldRule,
        });
      }
    }

    return changes;
  }

  /**
   * 获取字段变更详情
   */
  private getFieldChangeDetails(
    oldField: FieldSchema,
    newField: FieldSchema
  ): string {
    const details: string[] = [];

    if (oldField.label !== newField.label) {
      details.push(`标题: ${oldField.label} → ${newField.label}`);
    }
    if (oldField.dataSchema.required !== newField.dataSchema.required) {
      details.push(`必填: ${oldField.dataSchema.required} → ${newField.dataSchema.required}`);
    }
    if (oldField.uiSchema.width !== newField.uiSchema.width) {
      details.push(`宽度: ${oldField.uiSchema.width} → ${newField.uiSchema.width}`);
    }

    return details.length > 0 ? details.join('; ') : '配置已更新';
  }

  /**
   * 获取初始变更（第一个版本）
   */
  private getInitialChanges(schema: FormSchema): VersionChange[] {
    const changes: VersionChange[] = [];

    changes.push({
      type: 'add',
      target: 'form',
      targetId: schema.formId,
      targetName: schema.formName,
      details: '创建表单',
    });

    for (const field of schema.fields) {
      changes.push({
        type: 'add',
        target: 'field',
        targetId: field.fieldId,
        targetName: field.label,
        details: `添加${field.fieldType}字段`,
      });
    }

    for (const rule of schema.rules) {
      changes.push({
        type: 'add',
        target: 'rule',
        targetId: rule.ruleId,
        targetName: rule.ruleName,
        details: `添加${rule.ruleType}规则`,
      });
    }

    return changes;
  }

  /**
   * 深度克隆
   */
  private deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * 深度比较
   */
  private deepEqual(a: unknown, b: unknown): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  /**
   * 生成 ID
   */
  private generateId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
  }

  /**
   * 获取变更摘要文本
   */
  static getChangeSummary(changes: VersionChange[]): string {
    const added = changes.filter(c => c.type === 'add').length;
    const updated = changes.filter(c => c.type === 'update').length;
    const deleted = changes.filter(c => c.type === 'delete').length;

    const parts: string[] = [];
    if (added > 0) parts.push(`新增 ${added}`);
    if (updated > 0) parts.push(`更新 ${updated}`);
    if (deleted > 0) parts.push(`删除 ${deleted}`);

    return parts.join(', ') || '无变更';
  }

  /**
   * 获取变更类型图标
   */
  static getChangeTypeIcon(type: VersionChange['type']): string {
    const icons: Record<VersionChange['type'], string> = {
      add: '➕',
      update: '✏️',
      delete: '🗑️',
    };
    return icons[type];
  }

  /**
   * 获取目标类型标签
   */
  static getTargetTypeLabel(target: VersionChange['target']): string {
    const labels: Record<VersionChange['target'], string> = {
      field: '字段',
      rule: '规则',
      form: '表单',
    };
    return labels[target];
  }

  /**
   * 清空所有版本（用于测试）
   */
  clear(): void {
    this.versions.clear();
  }

  /**
   * 设置最大版本数
   */
  setMaxVersions(max: number): void {
    this.maxVersions = max;
  }
}

// ============ 导出单例 ============
export const versionManager = new VersionManager();
