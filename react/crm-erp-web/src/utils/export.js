/**
 * 导入导出工具函数
 */

// 导出为 CSV 文件
export const exportToCsv = (data, filename = 'export.csv', headers = []) => {
  try {
    // 如果没有提供表头,从第一条数据自动生成
    if (headers.length === 0 && data.length > 0) {
      headers = Object.keys(data[0]);
    }

    // 生成 CSV 内容
    const csvContent = [
      // 表头
      headers.join(','),
      // 数据行
      ...data.map(row =>
        headers.map(header => {
          const value = row[header];
          // 处理包含逗号、换行、引号的值
          if (value === null || value === undefined) return '';
          const stringValue = String(value);
          if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        }).join(',')
      ),
    ].join('\n');

    // 添加 BOM 头以支持中文
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // 触发下载
    downloadBlob(blob, filename);
    
    return true;
  } catch (error) {
    console.error('CSV 导出失败:', error);
    return false;
  }
};

// 导出为 Excel 文件 (使用 CSV 格式,Excel 可以打开)
export const exportToExcel = (data, filename = 'export.xlsx', headers = []) => {
  return exportToCsv(data, filename.replace('.xlsx', '.csv'), headers);
};

// 从 CSV 文件导入
export const importFromCsv = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length === 0) {
          reject(new Error('文件为空'));
          return;
        }

        // 解析表头
        const headers = parseCsvLine(lines[0]);
        
        // 解析数据行
        const data = lines.slice(1).map(line => {
          const values = parseCsvLine(line);
          const row = {};
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });
          return row;
        });

        resolve({ headers, data });
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('文件读取失败'));
    };

    reader.readAsText(file, 'UTF-8');
  });
};

// 解析 CSV 行 (处理引号和逗号)
const parseCsvLine = (line) => {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // 双引号转义
        current += '"';
        i++;
      } else {
        // 切换引号状态
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // 字段分隔符
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
};

// 下载 Blob 对象
const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// 将对象数组转换为适合导出的格式
export const formatDataForExport = (data, mapping = {}) => {
  return data.map(item => {
    const formatted = {};
    Object.entries(mapping).forEach(([key, label]) => {
      formatted[label] = getNestedValue(item, key);
    });
    return formatted;
  });
};

// 获取嵌套对象的值
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => {
    return current?.[key];
  }, obj);
};

// 客户数据导出映射
export const CUSTOMER_EXPORT_MAPPING = {
  code: '客户编号',
  name: '客户名称',
  type: '客户类型',
  level: '客户等级',
  industry: '所属行业',
  source: '客户来源',
  'contact.person': '联系人',
  'contact.phone': '联系电话',
  'contact.email': '电子邮箱',
  'contact.address': '联系地址',
  salesPersonName: '负责销售',
  followUpCount: '跟进次数',
  totalOrderCount: '订单总数',
  totalOrderAmount: '累计金额',
  remark: '备注',
};

// 导出客户数据
export const exportCustomers = (customers) => {
  const formattedData = formatDataForExport(customers, CUSTOMER_EXPORT_MAPPING);
  const filename = `客户数据_${new Date().getTime()}.csv`;
  return exportToCsv(formattedData, filename, Object.values(CUSTOMER_EXPORT_MAPPING));
};
