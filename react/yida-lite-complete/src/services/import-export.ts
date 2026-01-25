/**
 * Import/Export Service - 导入导出服务
 * Phase 3 Week 10: 完整的导入导出功能
 * 
 * 支持格式：
 * - JSON: 完整数据结构
 * - CSV: 扁平化表格数据
 * - Excel (XLSX): 带格式的表格
 */

import { FormSchema, FieldSchema, FieldType } from '../schema/types';

// ============ 导出格式 ============
export type ExportFormat = 'json' | 'csv' | 'xlsx';

// ============ 导出选项 ============
export interface ExportOptions {
  format: ExportFormat;
  includeMetadata?: boolean;     // 是否包含元数据（创建时间等）
  includeSubTables?: boolean;    // 是否展开子表
  columns?: string[];            // 指定导出的列
  filename?: string;             // 文件名
  dateFormat?: string;           // 日期格式
}

// ============ 导入选项 ============
export interface ImportOptions {
  format?: ExportFormat;         // 自动检测如果未指定
  skipHeader?: boolean;          // 是否跳过标题行
  columnMapping?: Record<string, string>;  // 列名映射
  validateData?: boolean;        // 是否验证数据
  onError?: 'skip' | 'abort' | 'collect';  // 错误处理策略
}

// ============ 导入结果 ============
export interface ImportResult {
  success: number;
  failed: number;
  total: number;
  errors: ImportError[];
  data: Array<Record<string, unknown>>;
}

// ============ 导入错误 ============
export interface ImportError {
  row: number;
  column?: string;
  value?: unknown;
  message: string;
}

// ============ 导入导出服务 ============
export class ImportExportService {
  
  // ========== 导出功能 ==========

  /**
   * 导出数据
   */
  async export(
    schema: FormSchema,
    records: Array<Record<string, unknown>>,
    options: ExportOptions
  ): Promise<Blob> {
    const { format } = options;

    switch (format) {
      case 'json':
        return this.exportToJSON(schema, records, options);
      case 'csv':
        return this.exportToCSV(schema, records, options);
      case 'xlsx':
        return this.exportToXLSX(schema, records, options);
      default:
        throw new Error(`不支持的导出格式: ${format}`);
    }
  }

  /**
   * 导出为 JSON
   */
  private async exportToJSON(
    schema: FormSchema,
    records: Array<Record<string, unknown>>,
    options: ExportOptions
  ): Promise<Blob> {
    const exportData = {
      schema: {
        formId: schema.formId,
        formName: schema.formName,
        schemaVersion: schema.schemaVersion,
      },
      fields: schema.fields.map(f => ({
        fieldKey: f.fieldKey,
        label: f.label,
        type: f.fieldType,
      })),
      records: options.includeMetadata ? records : records.map(r => {
        const { createdAt, updatedAt, createdBy, updatedBy, ...data } = r as any;
        return data;
      }),
      exportedAt: new Date().toISOString(),
      totalRecords: records.length,
    };

    const json = JSON.stringify(exportData, null, 2);
    return new Blob([json], { type: 'application/json;charset=utf-8' });
  }

  /**
   * 导出为 CSV
   */
  private async exportToCSV(
    schema: FormSchema,
    records: Array<Record<string, unknown>>,
    options: ExportOptions
  ): Promise<Blob> {
    // 获取要导出的字段
    const fields = this.getExportFields(schema, options);
    
    // 生成表头
    const headers = fields.map(f => f.label);
    
    // 生成数据行
    const rows = records.map(record => {
      return fields.map(field => {
        const value = record[field.fieldKey];
        return this.formatCellValue(value, field, options);
      });
    });

    // 组装 CSV
    const csvContent = [
      headers.map(h => this.escapeCSV(h)).join(','),
      ...rows.map(row => row.map(cell => this.escapeCSV(String(cell))).join(',')),
    ].join('\n');

    // 添加 BOM 以支持 Excel 正确识别中文
    const BOM = '\uFEFF';
    return new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8' });
  }

  /**
   * 导出为 XLSX（简化版，生成 CSV 格式但用 xlsx 扩展名）
   */
  private async exportToXLSX(
    schema: FormSchema,
    records: Array<Record<string, unknown>>,
    options: ExportOptions
  ): Promise<Blob> {
    // 简化实现：生成带格式的 HTML 表格，可被 Excel 打开
    const fields = this.getExportFields(schema, options);
    
    let html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" 
            xmlns:x="urn:schemas-microsoft-com:office:excel">
      <head>
        <meta charset="UTF-8">
        <style>
          table { border-collapse: collapse; }
          th, td { border: 1px solid #000; padding: 8px; }
          th { background: #f0f0f0; font-weight: bold; }
        </style>
      </head>
      <body>
        <table>
          <thead>
            <tr>${fields.map(f => `<th>${f.label}</th>`).join('')}</tr>
          </thead>
          <tbody>
    `;

    for (const record of records) {
      html += '<tr>';
      for (const field of fields) {
        const value = record[field.fieldKey];
        const formatted = this.formatCellValue(value, field, options);
        html += `<td>${this.escapeHTML(String(formatted))}</td>`;
      }
      html += '</tr>';
    }

    html += '</tbody></table></body></html>';

    return new Blob([html], { 
      type: 'application/vnd.ms-excel;charset=utf-8' 
    });
  }

  // ========== 导入功能 ==========

  /**
   * 导入数据
   */
  async import(
    schema: FormSchema,
    file: File,
    options: ImportOptions = {}
  ): Promise<ImportResult> {
    const format = options.format || this.detectFormat(file.name);
    const text = await file.text();

    switch (format) {
      case 'json':
        return this.importFromJSON(schema, text, options);
      case 'csv':
        return this.importFromCSV(schema, text, options);
      default:
        throw new Error(`不支持的导入格式: ${format}`);
    }
  }

  /**
   * 从 JSON 导入
   */
  private async importFromJSON(
    schema: FormSchema,
    text: string,
    options: ImportOptions
  ): Promise<ImportResult> {
    const result: ImportResult = {
      success: 0,
      failed: 0,
      total: 0,
      errors: [],
      data: [],
    };

    try {
      const parsed = JSON.parse(text);
      const records = Array.isArray(parsed) ? parsed : parsed.records || [];
      result.total = records.length;

      for (let i = 0; i < records.length; i++) {
        try {
          const record = records[i];
          
          // 数据验证
          if (options.validateData !== false) {
            const errors = this.validateRecord(schema, record, i);
            if (errors.length > 0) {
              result.errors.push(...errors);
              if (options.onError === 'abort') {
                result.failed = result.total - result.success;
                return result;
              }
              if (options.onError !== 'skip') {
                result.failed++;
                continue;
              }
            }
          }

          // 列名映射
          const mappedRecord = this.applyColumnMapping(record, options.columnMapping);
          result.data.push(mappedRecord);
          result.success++;
        } catch (error) {
          result.errors.push({
            row: i + 1,
            message: String(error),
          });
          result.failed++;
          if (options.onError === 'abort') {
            return result;
          }
        }
      }
    } catch (error) {
      result.errors.push({
        row: 0,
        message: `JSON 解析失败: ${error}`,
      });
    }

    return result;
  }

  /**
   * 从 CSV 导入
   */
  private async importFromCSV(
    schema: FormSchema,
    text: string,
    options: ImportOptions
  ): Promise<ImportResult> {
    const result: ImportResult = {
      success: 0,
      failed: 0,
      total: 0,
      errors: [],
      data: [],
    };

    const lines = text.split(/\r?\n/).filter(line => line.trim());
    if (lines.length === 0) {
      result.errors.push({ row: 0, message: 'CSV 文件为空' });
      return result;
    }

    // 解析表头
    const headerLine = options.skipHeader === false ? null : lines[0];
    const headers = headerLine ? this.parseCSVLine(headerLine) : [];
    const startRow = headerLine ? 1 : 0;

    // 字段映射
    const fieldMap = this.buildFieldMap(schema, headers, options.columnMapping);

    result.total = lines.length - startRow;

    for (let i = startRow; i < lines.length; i++) {
      try {
        const values = this.parseCSVLine(lines[i]);
        const record: Record<string, unknown> = {};

        // 映射值到字段
        for (let j = 0; j < values.length; j++) {
          const fieldKey = fieldMap[j];
          if (fieldKey) {
            const field = schema.fields.find(f => f.fieldKey === fieldKey);
            record[fieldKey] = this.parseValue(values[j], field);
          }
        }

        // 数据验证
        if (options.validateData !== false) {
          const errors = this.validateRecord(schema, record, i);
          if (errors.length > 0) {
            result.errors.push(...errors);
            if (options.onError === 'abort') {
              result.failed = result.total - result.success;
              return result;
            }
            if (options.onError === 'skip') {
              result.failed++;
              continue;
            }
          }
        }

        result.data.push(record);
        result.success++;
      } catch (error) {
        result.errors.push({
          row: i + 1,
          message: String(error),
        });
        result.failed++;
        if (options.onError === 'abort') {
          return result;
        }
      }
    }

    return result;
  }

  // ========== 辅助方法 ==========

  /**
   * 获取导出字段
   */
  private getExportFields(
    schema: FormSchema,
    options: ExportOptions
  ): FieldSchema[] {
    let fields = schema.fields.filter(f => 
      f.fieldType !== FieldType.SUB_TABLE && 
      f.fieldType !== FieldType.COMPUTED
    );

    if (options.columns) {
      fields = fields.filter(f => options.columns!.includes(f.fieldKey));
    }

    return fields;
  }

  /**
   * 格式化单元格值
   */
  private formatCellValue(
    value: unknown,
    field: FieldSchema,
    options: ExportOptions
  ): string {
    if (value === null || value === undefined) {
      return '';
    }

    if (Array.isArray(value)) {
      return value.join('; ');
    }

    if (value instanceof Date) {
      return options.dateFormat 
        ? this.formatDate(value, options.dateFormat)
        : value.toISOString();
    }

    if (typeof value === 'object') {
      return JSON.stringify(value);
    }

    return String(value);
  }

  /**
   * CSV 转义
   */
  private escapeCSV(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  /**
   * HTML 转义
   */
  private escapeHTML(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /**
   * 解析 CSV 行
   */
  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (inQuotes) {
        if (char === '"') {
          if (line[i + 1] === '"') {
            current += '"';
            i++;
          } else {
            inQuotes = false;
          }
        } else {
          current += char;
        }
      } else {
        if (char === '"') {
          inQuotes = true;
        } else if (char === ',') {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
    }
    
    result.push(current.trim());
    return result;
  }

  /**
   * 检测文件格式
   */
  private detectFormat(filename: string): ExportFormat {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'json': return 'json';
      case 'csv': return 'csv';
      case 'xlsx':
      case 'xls': return 'xlsx';
      default: return 'csv';
    }
  }

  /**
   * 构建字段映射
   */
  private buildFieldMap(
    schema: FormSchema,
    headers: string[],
    customMapping?: Record<string, string>
  ): Record<number, string> {
    const map: Record<number, string> = {};

    for (let i = 0; i < headers.length; i++) {
      const header = headers[i].trim();
      
      // 自定义映射优先
      if (customMapping && customMapping[header]) {
        map[i] = customMapping[header];
        continue;
      }

      // 按 label 匹配
      const fieldByLabel = schema.fields.find(f => f.label === header);
      if (fieldByLabel) {
        map[i] = fieldByLabel.fieldKey;
        continue;
      }

      // 按 fieldKey 匹配
      const fieldByKey = schema.fields.find(f => f.fieldKey === header);
      if (fieldByKey) {
        map[i] = fieldByKey.fieldKey;
      }
    }

    return map;
  }

  /**
   * 解析值
   */
  private parseValue(value: string, field?: FieldSchema): unknown {
    if (!field) return value;

    switch (field.fieldType) {
      case FieldType.NUMBER:
        const num = parseFloat(value);
        return isNaN(num) ? null : num;
      
      case FieldType.DATE:
        const date = new Date(value);
        return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0];
      
      case FieldType.CHECKBOX:
        // 支持多种分隔符
        return value.split(/[;,|]/).map(v => v.trim()).filter(Boolean);
      
      default:
        return value;
    }
  }

  /**
   * 应用列名映射
   */
  private applyColumnMapping(
    record: Record<string, unknown>,
    mapping?: Record<string, string>
  ): Record<string, unknown> {
    if (!mapping) return record;

    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(record)) {
      const mappedKey = mapping[key] || key;
      result[mappedKey] = value;
    }
    return result;
  }

  /**
   * 验证记录
   */
  private validateRecord(
    schema: FormSchema,
    record: Record<string, unknown>,
    rowIndex: number
  ): ImportError[] {
    const errors: ImportError[] = [];

    for (const field of schema.fields) {
      const value = record[field.fieldKey];

      // 必填检查
      if (field.dataSchema.required) {
        if (value === null || value === undefined || value === '') {
          errors.push({
            row: rowIndex + 1,
            column: field.fieldKey,
            value,
            message: `字段 "${field.label}" 为必填`,
          });
        }
      }

      // 类型检查
      if (value !== null && value !== undefined && value !== '') {
        if (field.fieldType === FieldType.NUMBER && typeof value !== 'number') {
          const num = Number(value);
          if (isNaN(num)) {
            errors.push({
              row: rowIndex + 1,
              column: field.fieldKey,
              value,
              message: `字段 "${field.label}" 必须是数字`,
            });
          }
        }
      }
    }

    return errors;
  }

  /**
   * 格式化日期
   */
  private formatDate(date: Date, format: string): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    
    return format
      .replace('YYYY', date.getFullYear().toString())
      .replace('MM', pad(date.getMonth() + 1))
      .replace('DD', pad(date.getDate()))
      .replace('HH', pad(date.getHours()))
      .replace('mm', pad(date.getMinutes()))
      .replace('ss', pad(date.getSeconds()));
  }

  /**
   * 生成下载
   */
  download(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

// ============ 导出单例 ============
export const importExportService = new ImportExportService();
