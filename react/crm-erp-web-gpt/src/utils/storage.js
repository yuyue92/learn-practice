import { encrypt, decrypt } from './crypto.js';

export function lsGet(key, fallback = null) {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try { return JSON.parse(raw); } catch { return fallback; }
}

export function lsSet(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function lsRemove(key) {
  localStorage.removeItem(key);
}

export function secureSet(key, valueObj) {
  lsSet(key, encrypt(JSON.stringify(valueObj)));
}

export function secureGet(key) {
  const raw = lsGet(key, '');
  if (!raw) return null;
  const txt = decrypt(raw);
  try { return JSON.parse(txt); } catch { return null; }
}
