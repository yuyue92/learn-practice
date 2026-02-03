import { format } from 'date-fns';

export function fmtDateTime(v) {
  if (!v) return '-';
  try { return format(new Date(v), 'yyyy-MM-dd HH:mm'); } catch { return String(v); }
}

export function fmtMoney(v) {
  const n = Number(v || 0);
  return n.toLocaleString('zh-CN', { style: 'currency', currency: 'CNY' });
}

export function maskPhone(phone) {
  const s = String(phone || '');
  if (s.length < 7) return s;
  return `${s.slice(0, 3)}****${s.slice(-4)}`;
}
