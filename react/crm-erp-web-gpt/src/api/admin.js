import { dbLoad, dbSave } from './mockDb.js';
import { uid } from '../utils/id.js';
import { writeLog } from './logger.js';

export async function listUsers({ page = 1, pageSize = 10, keyword = '' }) {
  const db = dbLoad();
  const k = keyword.trim();
  const all = (db.users || []).filter((u) => !k || u.username.includes(k) || u.name.includes(k));
  const total = all.length;
  const list = all.slice((page - 1) * pageSize, page * pageSize);
  return { list, total };
}

export async function upsertUser(payload, { userId }) {
  const db = dbLoad();
  const next = structuredClone(db);
  next.users = next.users || [];
  if (payload.id) {
    const idx = next.users.findIndex((u) => u.id === payload.id);
    if (idx >= 0) next.users[idx] = { ...next.users[idx], ...payload };
    writeLog({ module: 'admin', action: 'update_user', detail: payload.username, userId });
  } else {
    const u = { ...payload, id: uid('u') };
    next.users.unshift(u);
    writeLog({ module: 'admin', action: 'create_user', detail: payload.username, userId });
  }
  dbSave(next);
  return true;
}

export async function toggleUser(id, status, { userId }) {
  const db = dbLoad();
  const next = structuredClone(db);
  const u = next.users.find((x) => x.id === id);
  if (!u) throw new Error('用户不存在');
  u.status = status;
  dbSave(next);
  writeLog({ module: 'admin', action: 'toggle_user', detail: `${u.username} => ${status}`, userId });
  return true;
}

export async function getConfig() {
  const db = dbLoad();
  return db.config || {};
}

export async function saveConfig(cfg, { userId }) {
  const db = dbLoad();
  const next = structuredClone(db);
  next.config = { ...next.config, ...cfg };
  dbSave(next);
  writeLog({ module: 'admin', action: 'save_config', detail: '更新全局参数', userId });
  return true;
}

export async function listLogs({ page = 1, pageSize = 12 }) {
  const db = dbLoad();
  const all = db.logs || [];
  const total = all.length;
  const list = all.slice((page - 1) * pageSize, page * pageSize);
  return { list, total };
}
