import { dbLoad, dbSave } from './mockDb.js';
import { uid } from '../utils/id.js';
import { writeLog } from './logger.js';

export async function listOrders({ page = 1, pageSize = 10, keyword = '', user }) {
  const db = dbLoad();
  const k = keyword.trim();
  let all = db.orders || [];
  if (user?.role === 'SALES') all = all.filter((o) => o.ownerId === user.id);
  if (k) all = all.filter((o) => o.id.includes(k) || o.status.includes(k));
  const total = all.length;
  const list = all.slice((page - 1) * pageSize, page * pageSize);
  return { list, total };
}

export async function upsertOrder(payload, { userId }) {
  const db = dbLoad();
  const next = structuredClone(db);
  next.orders = next.orders || [];
  if (payload.id) {
    const idx = next.orders.findIndex((o) => o.id === payload.id);
    if (idx >= 0) next.orders[idx] = { ...next.orders[idx], ...payload };
    writeLog({ module: 'orders', action: 'update', detail: payload.id, userId });
  } else {
    next.orders.unshift({ ...payload, id: uid('o'), createdAt: new Date().toISOString() });
    writeLog({ module: 'orders', action: 'create', detail: 'new', userId });
  }
  dbSave(next);
  return true;
}
