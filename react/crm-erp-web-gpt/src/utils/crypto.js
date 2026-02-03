/**
 * 轻量加密（演示用）：XOR + base64
 * 生产建议：后端 httpOnly cookie / 更强的加密方案
 */
const KEY = 'CRM_ERP_WEB_KEY';

function xor(str) {
  let out = '';
  for (let i = 0; i < str.length; i += 1) {
    out += String.fromCharCode(str.charCodeAt(i) ^ KEY.charCodeAt(i % KEY.length));
  }
  return out;
}

export function encrypt(text) {
  const x = xor(String(text));
  return btoa(unescape(encodeURIComponent(x)));
}

export function decrypt(cipher) {
  try {
    const x = decodeURIComponent(escape(atob(String(cipher))));
    return xor(x);
  } catch {
    return '';
  }
}
