import React from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.js';
import { usePermission } from '../../hooks/usePermission.js';
import { useUiStore } from '../../stores/uiStore.js';

function Item({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block rounded-xl px-3 py-2 text-sm ${isActive ? 'bg-brand-50 text-brand-700 dark:bg-brand-700/20 dark:text-brand-50' : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-900'}`
      }
    >
      {label}
    </NavLink>
  );
}

export default function Sidebar() {
  const { canRoute } = usePermission();
  const theme = useUiStore((s) => s.theme);
  const setTheme = useUiStore((s) => s.setTheme);

  return (
    <aside className="h-screen w-[260px] shrink-0 border-r border-slate-200/70 bg-white p-3 dark:border-slate-800/70 dark:bg-slate-900">
      <div className="flex items-center justify-between px-2 py-2">
        <div className="text-sm font-semibold">CRM/ERP</div>
        <button className="ui-btn ui-btn-ghost" type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? '亮色' : '暗黑'}
        </button>
      </div>

      <div className="mt-3 space-y-1">
        {canRoute('HOME') ? <Item to={ROUTES.HOME} label="首页仪表盘" /> : null}
        {canRoute('CUSTOMERS') ? <Item to={ROUTES.CUSTOMERS} label="客户管理" /> : null}
        {canRoute('SALES') ? <Item to={ROUTES.ORDERS} label="销售订单" /> : null}
        {canRoute('INVENTORY') ? <Item to={ROUTES.INVENTORY} label="产品与库存" /> : null}
        {canRoute('PURCHASE') ? <Item to={ROUTES.PURCHASE} label="采购管理" /> : null}
        {canRoute('FINANCE') ? <Item to={ROUTES.FINANCE} label="财务与回款" /> : null}
        {canRoute('REPORTS') ? <Item to={ROUTES.REPORTS} label="数据报表" /> : null}
        {canRoute('ME') ? <Item to={ROUTES.ME} label="个人中心" /> : null}
      </div>

      <div className="mt-6 border-t border-slate-200/60 pt-4 dark:border-slate-800/60">
        <div className="px-2 text-xs font-semibold text-slate-500">系统管理</div>
        <div className="mt-2 space-y-1">
          {canRoute('ADMIN_USERS') ? <Item to={ROUTES.ADMIN_USERS} label="用户与权限" /> : null}
          {canRoute('ADMIN_CONFIG') ? <Item to={ROUTES.ADMIN_CONFIG} label="系统配置与日志" /> : null}
        </div>
      </div>
    </aside>
  );
}
