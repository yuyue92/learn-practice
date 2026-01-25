/**
 * Data Store - 数据存储层
 * Phase 2: CRUD 操作、列表视图支持
 * 
 * 功能：
 * - 表单记录 CRUD
 * - 列表查询（分页、排序）
 * - 数据导入/导出
 * - Schema 版本管理
 */

import { FormSchema, FieldSchema, FieldType } from '../schema/types';

// ============ 数据记录 ============
export interface FormRecord {
  recordId: string;
  formId: string;
  data: Record<string, unknown>;
  
  // 元数据
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
  
  // Schema 版本（用于数据迁移）
  schemaVersion: number;
}

// ============ 列表查询选项 ============
export interface ListOptions {
  page: number;
  pageSize: number;
  orderBy?: string;
  orderDir?: 'asc' | 'desc';
  filters?: ListFilter[];
}

// ============ 列表过滤条件 ============
export interface ListFilter {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains' | 'startsWith';
  value: unknown;
}

// ============ 分页结果 ============
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============ 导入结果 ============
export interface ImportResult {
  success: number;
  failed: number;
  errors: Array<{ row: number; message: string }>;
}

// ============ 数据存储接口 ============
export interface IDataStore {
  // CRUD
  create(formId: string, data: Record<string, unknown>, userId: string): Promise<FormRecord>;
  update(recordId: string, data: Record<string, unknown>, userId: string): Promise<FormRecord>;
  delete(recordId: string): Promise<void>;
  get(recordId: string): Promise<FormRecord | null>;
  
  // 列表查询
  list(formId: string, options: ListOptions): Promise<PaginatedResult<FormRecord>>;
  
  // 批量操作
  batchCreate(formId: string, dataList: Array<Record<string, unknown>>, userId: string): Promise<FormRecord[]>;
  batchDelete(recordIds: string[]): Promise<void>;
  
  // 导出/导入
  export(formId: string, format: 'json' | 'csv'): Promise<Blob>;
  import(formId: string, file: File, userId: string): Promise<ImportResult>;
}

// ============ 内存数据存储实现 ============
export class MemoryDataStore implements IDataStore {
  private records: Map<string, FormRecord> = new Map();
  private formRecords: Map<string, Set<string>> = new Map(); // formId -> recordIds

  /**
   * 生成 UUID
   */
  private generateId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
  }

  /**
   * 创建记录
   */
  async create(formId: string, data: Record<string, unknown>, userId: string): Promise<FormRecord> {
    const now = new Date();
    const record: FormRecord = {
      recordId: this.generateId(),
      formId,
      data,
      createdAt: now,
      updatedAt: now,
      createdBy: userId,
      updatedBy: userId,
      schemaVersion: 1,
    };

    this.records.set(record.recordId, record);
    
    if (!this.formRecords.has(formId)) {
      this.formRecords.set(formId, new Set());
    }
    this.formRecords.get(formId)!.add(record.recordId);

    return record;
  }

  /**
   * 更新记录
   */
  async update(recordId: string, data: Record<string, unknown>, userId: string): Promise<FormRecord> {
    const existing = this.records.get(recordId);
    if (!existing) {
      throw new Error(`记录不存在: ${recordId}`);
    }

    const updated: FormRecord = {
      ...existing,
      data: { ...existing.data, ...data },
      updatedAt: new Date(),
      updatedBy: userId,
    };

    this.records.set(recordId, updated);
    return updated;
  }

  /**
   * 删除记录
   */
  async delete(recordId: string): Promise<void> {
    const record = this.records.get(recordId);
    if (record) {
      this.records.delete(recordId);
      this.formRecords.get(record.formId)?.delete(recordId);
    }
  }

  /**
   * 获取单条记录
   */
  async get(recordId: string): Promise<FormRecord | null> {
    return this.records.get(recordId) || null;
  }

  /**
   * 列表查询
   */
  async list(formId: string, options: ListOptions): Promise<PaginatedResult<FormRecord>> {
    const { page, pageSize, orderBy, orderDir = 'desc', filters } = options;
    
    // 获取表单的所有记录
    const recordIds = this.formRecords.get(formId) || new Set();
    let records = Array.from(recordIds)
      .map(id => this.records.get(id)!)
      .filter(Boolean);

    // 应用过滤
    if (filters && filters.length > 0) {
      records = this.applyFilters(records, filters);
    }

    // 排序
    if (orderBy) {
      records = this.sortRecords(records, orderBy, orderDir);
    } else {
      // 默认按创建时间倒序
      records.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    // 分页
    const total = records.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const paginatedData = records.slice(startIndex, startIndex + pageSize);

    return {
      data: paginatedData,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  /**
   * 批量创建
   */
  async batchCreate(
    formId: string,
    dataList: Array<Record<string, unknown>>,
    userId: string
  ): Promise<FormRecord[]> {
    const results: FormRecord[] = [];
    for (const data of dataList) {
      const record = await this.create(formId, data, userId);
      results.push(record);
    }
    return results;
  }

  /**
   * 批量删除
   */
  async batchDelete(recordIds: string[]): Promise<void> {
    for (const id of recordIds) {
      await this.delete(id);
    }
  }

  /**
   * 导出数据
   */
  async export(formId: string, format: 'json' | 'csv'): Promise<Blob> {
    const { data: records } = await this.list(formId, { page: 1, pageSize: 10000 });
    
    if (format === 'json') {
      const jsonData = JSON.stringify(records.map(r => r.data), null, 2);
      return new Blob([jsonData], { type: 'application/json' });
    } else {
      // CSV 格式
      const csvData = this.toCSV(records);
      return new Blob([csvData], { type: 'text/csv' });
    }
  }

  /**
   * 导入数据
   */
  async import(formId: string, file: File, userId: string): Promise<ImportResult> {
    const result: ImportResult = { success: 0, failed: 0, errors: [] };
    
    try {
      const text = await file.text();
      let dataList: Array<Record<string, unknown>>;
      
      if (file.name.endsWith('.json')) {
        dataList = JSON.parse(text);
      } else if (file.name.endsWith('.csv')) {
        dataList = this.parseCSV(text);
      } else {
        throw new Error('不支持的文件格式');
      }

      for (let i = 0; i < dataList.length; i++) {
        try {
          await this.create(formId, dataList[i], userId);
          result.success++;
        } catch (error) {
          result.failed++;
          result.errors.push({ row: i + 1, message: String(error) });
        }
      }
    } catch (error) {
      result.errors.push({ row: 0, message: `文件解析失败: ${error}` });
    }

    return result;
  }

  /**
   * 应用过滤条件
   */
  private applyFilters(records: FormRecord[], filters: ListFilter[]): FormRecord[] {
    return records.filter(record => {
      return filters.every(filter => {
        const value = record.data[filter.field];
        
        switch (filter.operator) {
          case 'eq': return value === filter.value;
          case 'neq': return value !== filter.value;
          case 'gt': return Number(value) > Number(filter.value);
          case 'lt': return Number(value) < Number(filter.value);
          case 'gte': return Number(value) >= Number(filter.value);
          case 'lte': return Number(value) <= Number(filter.value);
          case 'contains': return String(value).includes(String(filter.value));
          case 'startsWith': return String(value).startsWith(String(filter.value));
          default: return true;
        }
      });
    });
  }

  /**
   * 排序记录
   */
  private sortRecords(
    records: FormRecord[],
    orderBy: string,
    orderDir: 'asc' | 'desc'
  ): FormRecord[] {
    return records.sort((a, b) => {
      let aVal: unknown;
      let bVal: unknown;

      // 支持元数据字段排序
      if (orderBy === 'createdAt') {
        aVal = a.createdAt.getTime();
        bVal = b.createdAt.getTime();
      } else if (orderBy === 'updatedAt') {
        aVal = a.updatedAt.getTime();
        bVal = b.updatedAt.getTime();
      } else {
        aVal = a.data[orderBy];
        bVal = b.data[orderBy];
      }

      // 比较
      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      const comparison = aVal < bVal ? -1 : 1;
      return orderDir === 'asc' ? comparison : -comparison;
    });
  }

  /**
   * 转换为 CSV
   */
  private toCSV(records: FormRecord[]): string {
    if (records.length === 0) return '';

    // 获取所有字段
    const fields = new Set<string>();
    records.forEach(r => Object.keys(r.data).forEach(k => fields.add(k)));
    const headers = Array.from(fields);

    // 生成 CSV
    const lines: string[] = [];
    lines.push(headers.join(','));

    for (const record of records) {
      const values = headers.map(h => {
        const val = record.data[h];
        if (val === null || val === undefined) return '';
        if (typeof val === 'string' && val.includes(',')) return `"${val}"`;
        return String(val);
      });
      lines.push(values.join(','));
    }

    return lines.join('\n');
  }

  /**
   * 解析 CSV
   */
  private parseCSV(text: string): Array<Record<string, unknown>> {
    const lines = text.split('\n').filter(l => l.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    const result: Array<Record<string, unknown>> = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      const record: Record<string, unknown> = {};
      
      headers.forEach((h, idx) => {
        let val = values[idx]?.trim() || '';
        // 移除引号
        if (val.startsWith('"') && val.endsWith('"')) {
          val = val.slice(1, -1);
        }
        record[h] = val;
      });

      result.push(record);
    }

    return result;
  }

  /**
   * 清空所有数据（用于测试）
   */
  clear(): void {
    this.records.clear();
    this.formRecords.clear();
  }

  /**
   * 获取统计信息
   */
  getStats(formId: string): { total: number; lastUpdated: Date | null } {
    const recordIds = this.formRecords.get(formId);
    if (!recordIds || recordIds.size === 0) {
      return { total: 0, lastUpdated: null };
    }

    const records = Array.from(recordIds)
      .map(id => this.records.get(id)!)
      .filter(Boolean);

    const lastUpdated = records.reduce((latest, r) => 
      r.updatedAt > latest ? r.updatedAt : latest, 
      records[0].updatedAt
    );

    return { total: records.length, lastUpdated };
  }
}

// ============ Schema 存储 ============
export interface SchemaVersion {
  versionId: string;
  formId: string;
  version: number;
  schema: FormSchema;
  createdAt: Date;
  comment?: string;
}

export class SchemaStore {
  private schemas: Map<string, FormSchema> = new Map();
  private versions: Map<string, SchemaVersion[]> = new Map();

  /**
   * 保存 Schema
   */
  save(schema: FormSchema, comment?: string): SchemaVersion {
    const formId = schema.formId;
    const existingVersions = this.versions.get(formId) || [];
    
    const version: SchemaVersion = {
      versionId: this.generateId(),
      formId,
      version: schema.schemaVersion,
      schema: JSON.parse(JSON.stringify(schema)), // 深拷贝
      createdAt: new Date(),
      comment,
    };

    existingVersions.push(version);
    this.versions.set(formId, existingVersions);
    this.schemas.set(formId, schema);

    return version;
  }

  /**
   * 获取最新 Schema
   */
  get(formId: string): FormSchema | null {
    return this.schemas.get(formId) || null;
  }

  /**
   * 获取指定版本
   */
  getVersion(formId: string, version: number): FormSchema | null {
    const versions = this.versions.get(formId) || [];
    const found = versions.find(v => v.version === version);
    return found?.schema || null;
  }

  /**
   * 获取版本历史
   */
  listVersions(formId: string): SchemaVersion[] {
    return this.versions.get(formId) || [];
  }

  /**
   * 回滚到指定版本
   */
  rollback(formId: string, version: number): FormSchema | null {
    const schema = this.getVersion(formId, version);
    if (schema) {
      // 创建新版本
      const newSchema = {
        ...schema,
        schemaVersion: (this.schemas.get(formId)?.schemaVersion || 0) + 1,
      };
      this.save(newSchema, `回滚到版本 ${version}`);
      return newSchema;
    }
    return null;
  }

  private generateId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
  }
}

// ============ 导出单例 ============
export const dataStore = new MemoryDataStore();
export const schemaStore = new SchemaStore();
