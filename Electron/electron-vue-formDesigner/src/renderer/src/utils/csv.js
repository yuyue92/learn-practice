// utils/csv.js
export function exportToCSV(data, headers = [], filename = 'data.csv') {
    const rows = [headers, ...data.map(item => headers.map(h => item[h]))];
    const csvContent = rows.map(row => row.join(',')).join('\n');
  
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  
    URL.revokeObjectURL(url);
}
  
export function importCSV(file, callback) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const text = e.target.result;
      const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
      const headers = lines[0].split(',');
  
      const result = lines.slice(1).map(row => {
        const values = row.split(',');
        const obj = {};
        headers.forEach((key, idx) => obj[key] = values[idx]);
        return obj;
      });
  
      callback(result);
    };
    reader.readAsText(file, 'utf-8');
}
  