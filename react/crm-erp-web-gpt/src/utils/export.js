import { saveAs } from 'file-saver';

export function exportJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' });
  saveAs(blob, filename);
}

export function exportCsv(filename, rows) {
  const keys = rows?.[0] ? Object.keys(rows[0]) : [];
  const csv = [
    keys.join(','),
    ...(rows || []).map((r) => keys.map((k) => JSON.stringify(r[k] ?? '')).join(','))
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, filename);
}
