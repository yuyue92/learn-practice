import { dbLoad, dbSave } from './mockDb.js';
import { uid } from '../utils/id.js';
import { writeLog } from './logger.js';

export async function listCustomers({ page = 1, pageSize = 10, keyword = '', user }) {
  const db = dbLoad();
  const k = keyword.trim();
  let all = db.customers || [];
  // 数据级鉴权：销售员工只能看自己
  if (user?.role === 'SALES') all = all.filter((c) => c.ownerId === user.id);
  if (k) all = all.filter((c) => c.name.includes(k) || (c.phone || '').includes(k));
  const total = all.length;
  const list = all.slice((page - 1) * pageSize, page * pageSize);
  return { list, total };
}

export async function getCustomer(id, user) {
  const db = dbLoad();
  const c = (db.customers || []).find((x) => x.id === id);
  if (!c) throw new Error('客户不存在');
  if (user?.role === 'SALES' && c.ownerId !== user.id) throw new Error('无权限查看该客户');
  const followups = (db.followups || []).filter((f) => f.customerId === id);
  const orders = (db.orders || []).filter((o) => o.customerId === id);
  return { ...c, followups, orders };
}

export async function upsertCustomer(payload, { userId }) {
  const db = dbLoad();
  const next = structuredClone(db);
  next.customers = next.customers || [];
  if (payload.id) {
    const idx = next.customers.findIndex((c) => c.id === payload.id);
    if (idx < 0) throw new Error('客户不存在');
    next.customers[idx] = { ...next.customers[idx], ...payload };
    writeLog({ module: 'customers', action: 'update', detail: payload.name, userId });
  } else {
    const c = { ...payload, id: uid('c'), createdAt: new Date().toISOString() };
    next.customers.unshift(c);
    writeLog({ module: 'customers', action: 'create', detail: payload.name, userId });
  }
  dbSave(next);
  return true;
}

export async function deleteCustomer(id, { userId }) {
  const db = dbLoad();
  const next = structuredClone(db);
  const c = next.customers.find((x) => x.id === id);
  if (!c) throw new Error('客户不存在');
  const linked = (next.orders || []).some((o) => o.customerId === id);
  if (linked) throw new Error('该客户已关联订单，禁止删除');
  next.customers = next.customers.filter((x) => x.id !== id);
  dbSave(next);
  writeLog({ module: 'customers', action: 'delete', detail: c.name, userId });
  return true;
}

export async function addFollowup(payload, { userId }) {
  const db = dbLoad();
  const next = structuredClone(db);
  next.followups = next.followups || [];
  next.followups.unshift({ ...payload, id: uid('f'), time: payload.time || new Date().toISOString() });
  dbSave(next);
  writeLog({ module: 'customers', action: 'followup', detail: payload.customerId, userId });
  return true;
}
