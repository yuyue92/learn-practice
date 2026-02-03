import { create } from 'zustand';
import Cookies from 'js-cookie';
import { secureGet, secureSet, lsRemove } from '../utils/storage.js';
import { apiLogin, apiLogout, apiMe } from '../api/auth.js';

const TOKEN_KEY = 'crm_token_secure';
const COOKIE_KEY = 'crm_token_present';

function now() { return Date.now(); }

function readToken() {
  const obj = secureGet(TOKEN_KEY);
  if (!obj) return null;
  if (obj.exp && obj.exp < now()) return null;
  return obj;
}

export const useAuthStore = create((set, get) => ({
  tokenObj: readToken(),
  user: null,
  bootstrapped: false,

  bootstrap: async () => {
    const tokenObj = readToken();
    if (!tokenObj) {
      set({ tokenObj: null, user: null, bootstrapped: true });
      return;
    }
    try {
      const me = await apiMe(tokenObj.token);
      set({ tokenObj, user: me, bootstrapped: true });
    } catch {
      lsRemove(TOKEN_KEY);
      Cookies.remove(COOKIE_KEY);
      set({ tokenObj: null, user: null, bootstrapped: true });
    }
  },

  login: async ({ username, password, remember }) => {
    const { token, exp } = await apiLogin({ username, password, remember });
    secureSet(TOKEN_KEY, { token, exp });
    Cookies.set(COOKIE_KEY, '1', { expires: 7 });
    const me = await apiMe(token);
    set({ tokenObj: { token, exp }, user: me });
    return me;
  },

  logout: async () => {
    const t = get().tokenObj?.token;
    try { if (t) await apiLogout(t); } catch {}
    lsRemove(TOKEN_KEY);
    Cookies.remove(COOKIE_KEY);
    set({ tokenObj: null, user: null });
  }
}));
