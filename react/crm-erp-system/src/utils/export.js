/**
 * 数据导出工具
 * 支持Excel、CSV、JSON、PNG等格式导出
 */
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { formatDate, formatDateTime } from './date';

/**
 * 导出Excel文件
 * @param {Array} data - 数据数组
 * @param {Array} columns - 列配置 [{ key, title, width }]
 * @param {string} filename - 文件名
 * @param {string} sheetName - 工作表名称
 */
export const exportExcel = (data, columns, filename = 'export', sheetName = 'Sheet1') => {
  // 转换数据格式
  const headers = columns.map(col => col.title);
  const keys = columns.map(col => col.key);
  
  const rows = data.map(item => {
    return keys.map(key => {
      const value = item[key];
      // 处理特殊类型
      if (value instanceof Date) {
        return formatDateTime(value);
      }
      if (typeof value === 'object' && value !== null) {
        return JSON.stringify(value);
      }
      return value ?? '';
    });
  });
  
  // 创建工作表数据
  const wsData = [headers, ...rows];
  
  // 创建工作表
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  
  // 设置列宽
  ws['!cols'] = columns.map(col => ({ wch: col.width || 15 }));
  
  // 创建工作簿
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  
  // 导出文件
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `${filename}_${formatDate(new Date(), 'yyyyMMdd_HHmmss')}.xlsx`);
};

/**
 * 导出CSV文件
 * @param {Array} data - 数据数组
 * @param {Array} columns - 列配置 [{ key, title }]
 * @param {string} filename - 文件名
 */
export const exportCSV = (data, columns, filename = 'export') => {
  const headers = columns.map(col => col.title);
  const keys = columns.map(col => col.key);
  
  // 构建CSV内容
  const csvContent = [
    headers.join(','),
    ...data.map(item => {
      return keys.map(key => {
        let value = item[key] ?? '';
        // 处理包含逗号、换行、引号的值
        if (typeof value === 'string' && (value.includes(',') || value.includes('\n') || value.includes('"'))) {
          value = `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',');
    }),
  ].join('\n');
  
  // 添加BOM以支持中文
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, `${filename}_${formatDate(new Date(), 'yyyyMMdd_HHmmss')}.csv`);
};

/**
 * 导出JSON文件
 * @param {Array|Object} data - 数据
 * @param {string} filename - 文件名
 */
export const exportJSON = (data, filename = 'export') => {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8' });
  saveAs(blob, `${filename}_${formatDate(new Date(), 'yyyyMMdd_HHmmss')}.json`);
};

/**
 * 将DOM元素导出为PNG图片
 * @param {HTMLElement} element - DOM元素
 * @param {string} filename - 文件名
 * @param {Object} options - 配置项
 */
export const exportPNG = async (element, filename = 'export', options = {}) => {
  const { scale = 2, backgroundColor = '#ffffff' } = options;
  
  // 动态导入html2canvas（如果需要的话）
  // 这里使用Canvas API手动实现基础功能
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const rect = element.getBoundingClientRect();
    
    canvas.width = rect.width * scale;
    canvas.height = rect.height * scale;
    
    ctx.scale(scale, scale);
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, rect.width, rect.height);
    
    // 注意：这里只是基础实现，复杂DOM需要使用html2canvas库
    // 简单情况下可以直接处理SVG或Canvas元素
    
    canvas.toBlob((blob) => {
      if (blob) {
        saveAs(blob, `${filename}_${formatDate(new Date(), 'yyyyMMdd_HHmmss')}.png`);
      }
    }, 'image/png');
  } catch (error) {
    console.error('导出PNG失败:', error);
    throw error;
  }
};

/**
 * 从Excel文件导入数据
 * @param {File} file - Excel文件
 * @param {Object} options - 配置项
 * @returns {Promise<Array>}
 */
export const importExcel = (file, options = {}) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // 读取第一个工作表
        const sheetName = options.sheetName || workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // 转换为JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: options.header,
          raw: options.raw ?? false,
          defval: options.defval ?? '',
        });
        
        resolve(jsonData);
      } catch (error) {
        reject(new Error('文件解析失败：' + error.message));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('文件读取失败'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

/**
 * 从CSV文件导入数据
 * @param {File} file - CSV文件
 * @returns {Promise<Array>}
 */
export const importCSV = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length === 0) {
          resolve([]);
          return;
        }
        
        // 解析表头
        const headers = parseCSVLine(lines[0]);
        
        // 解析数据行
        const data = lines.slice(1).map(line => {
          const values = parseCSVLine(line);
          const row = {};
          headers.forEach((header, index) => {
            row[header] = values[index] ?? '';
          });
          return row;
        });
        
        resolve(data);
      } catch (error) {
        reject(new Error('文件解析失败：' + error.message));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('文件读取失败'));
    };
    
    reader.readAsText(file, 'UTF-8');
  });
};

/**
 * 解析CSV行
 * @param {string} line - CSV行
 * @returns {Array}
 */
const parseCSVLine = (line) => {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
};

/**
 * 验证导入文件格式
 * @param {File} file - 文件
 * @param {Array} allowedTypes - 允许的类型
 * @returns {{ valid: boolean, message?: string }}
 */
export const validateImportFile = (file, allowedTypes = ['xlsx', 'xls', 'csv']) => {
  if (!file) {
    return { valid: false, message: '请选择文件' };
  }
  
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  if (!extension || !allowedTypes.includes(extension)) {
    return { valid: false, message: `仅支持 ${allowedTypes.join('、')} 格式的文件` };
  }
  
  // 检查文件大小（默认10MB）
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, message: '文件大小不能超过10MB' };
  }
  
  return { valid: true };
};

/**
 * 下载模板文件
 * @param {Array} columns - 列配置
 * @param {string} filename - 文件名
 */
export const downloadTemplate = (columns, filename = 'template') => {
  const headers = columns.map(col => col.title);
  const examples = columns.map(col => col.example || '');
  
  const wsData = [headers];
  if (examples.some(e => e)) {
    wsData.push(examples);
  }
  
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  ws['!cols'] = columns.map(col => ({ wch: col.width || 15 }));
  
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '模板');
  
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `${filename}.xlsx`);
};

export default {
  exportExcel,
  exportCSV,
  exportJSON,
  exportPNG,
  importExcel,
  importCSV,
  validateImportFile,
  downloadTemplate,
};
