import { dbLoad } from './mockDb.js';

function daysToMs(d) { return d * 24 * 60 * 60 * 1000; }

export async function apiLogin({ username, password, remember }) {
  if (!username || !password) throw new Error('账号或密码不能为空');
  const db = dbLoad();
  const u = (db.users || []).find((x) => x.username === username);
  if (!u) throw new Error('账号不存在');
  if (u.status !== 'ACTIVE') throw new Error('账号已禁用');
  const exp = Date.now() + daysToMs(remember ? Number(import.meta.env.VITE_AUTH_REMEMBER_DAYS || 7) : 1);
  // token 演示：username|exp
  const token = btoa(`${username}|${exp}`);
  return { token, exp };
}

export async function apiMe(token) {
  if (!token) throw new Error('未登录');
  const [username] = atob(token).split('|');
  const db = dbLoad();
  const u = (db.users || []).find((x) => x.username === username);
  if (!u) throw new Error('无效登录态');
  return u;
}

export async function apiLogout() {
  return true;
}
