import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore.js';
import { ROUTES } from '../../constants/routes.js';
import GlobalSearch from '../search/GlobalSearch.jsx';

export default function Topbar() {
  const nav = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <header className="flex items-center justify-between border-b border-slate-200/70 bg-white px-4 py-3 dark:border-slate-800/70 dark:bg-slate-900">
      <GlobalSearch />
      <div className="flex items-center gap-3">
        <div className="text-sm">
          <div className="font-semibold">{user?.name || '-'}</div>
          <div className="text-xs text-slate-500">{user?.role || ''}</div>
        </div>
        <button className="ui-btn ui-btn-ghost" type="button" onClick={async () => { await logout(); nav(ROUTES.LOGIN); }}>
          退出
        </button>
      </div>
    </header>
  );
}
