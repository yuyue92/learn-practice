import React from 'react';
import { dbLoad } from '../../api/mockDb.js';
import { fmtMoney } from '../../utils/format.js';
import { useAuthStore } from '../../stores/authStore.js';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.js';

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const db = dbLoad();

  const customers = db.customers || [];
  const products = db.products || [];
  const orders = db.orders || [];
  const followups = (db.followups || []).filter((f) => !f.done);

  const salesTotal = orders.reduce((s, o) => s + Number(o.amount || 0), 0);
  const stockWarn = products.filter((p) => Number(p.stock) < Number(p.warnThreshold || 0));

  const myFollowups = user?.role === 'SALES'
    ? followups.filter((f) => f.ownerId === user.id)
    : followups;

  return (
    <div className="space-y-4">
      <div className="ui-card p-4">
        <div className="text-sm font-semibold">首页仪表盘</div>
        <div className="mt-1 text-xs text-slate-500">核心数据概览 + 待办提醒</div>

        <div className="mt-4 grid grid-cols-4 gap-3">
          <div className="rounded-2xl border border-slate-200/60 p-3 dark:border-slate-800">
            <div className="text-xs text-slate-500">客户总数</div>
            <div className="mt-1 text-xl font-semibold">{customers.length}</div>
          </div>
          <div className="rounded-2xl border border-slate-200/60 p-3 dark:border-slate-800">
            <div className="text-xs text-slate-500">销售总额</div>
            <div className="mt-1 text-xl font-semibold">{fmtMoney(salesTotal)}</div>
          </div>
          <div className="rounded-2xl border border-slate-200/60 p-3 dark:border-slate-800">
            <div className="text-xs text-slate-500">库存品类</div>
            <div className="mt-1 text-xl font-semibold">{products.length}</div>
          </div>
          <div className="rounded-2xl border border-slate-200/60 p-3 dark:border-slate-800">
            <div className="text-xs text-slate-500">库存预警</div>
            <div className="mt-1 text-xl font-semibold">{stockWarn.length}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="ui-card p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">跟进提醒</div>
            <Link className="text-xs text-brand-600 hover:underline" to={ROUTES.CUSTOMERS}>去客户管理</Link>
          </div>
          <div className="mt-3 space-y-2">
            {myFollowups.slice(0, 6).map((f) => (
              <div key={f.id} className="rounded-xl border border-slate-200/60 p-3 text-sm dark:border-slate-800/60">
                <div className="font-semibold">客户：{f.customerId}</div>
                <div className="mt-1 text-xs text-slate-500">{f.content}</div>
              </div>
            ))}
            {myFollowups.length === 0 ? <div className="text-sm text-slate-500">暂无待办</div> : null}
          </div>
        </div>

        <div className="ui-card p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">库存预警</div>
            <Link className="text-xs text-brand-600 hover:underline" to={ROUTES.INVENTORY}>去库存</Link>
          </div>
          <div className="mt-3 space-y-2">
            {stockWarn.slice(0, 6).map((p) => (
              <div key={p.id} className="rounded-xl border border-slate-200/60 p-3 text-sm dark:border-slate-800/60">
                <div className="font-semibold">{p.name}</div>
                <div className="mt-1 text-xs text-slate-500">库存：{p.stock} / 阈值：{p.warnThreshold}</div>
              </div>
            ))}
            {stockWarn.length === 0 ? <div className="text-sm text-slate-500">暂无预警</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
