import { dbLoad, dbSave } from './mockDb.js';
import { uid } from '../utils/id.js';
import { writeLog } from './logger.js';

export async function listProducts({ page = 1, pageSize = 10, keyword = '' }) {
  const db = dbLoad();
  const k = keyword.trim();
  let all = db.products || [];
  if (k) all = all.filter((p) => p.name.includes(k) || (p.category || '').includes(k));
  const total = all.length;
  const list = all.slice((page - 1) * pageSize, page * pageSize);
  return { list, total };
}

export async function upsertProduct(payload, { userId }) {
  const db = dbLoad();
  const next = structuredClone(db);
  next.products = next.products || [];
  if (payload.id) {
    const idx = next.products.findIndex((p) => p.id === payload.id);
    if (idx >= 0) next.products[idx] = { ...next.products[idx], ...payload };
    writeLog({ module: 'products', action: 'update', detail: payload.name, userId });
  } else {
    next.products.unshift({ ...payload, id: uid('p') });
    writeLog({ module: 'products', action: 'create', detail: payload.name, userId });
  }
  dbSave(next);
  return true;
}
