import React from 'react';
import { useNavigate } from 'react-router-dom';
import { dbLoad } from '../../api/mockDb.js';
import { ROUTES } from '../../constants/routes.js';

export default function GlobalSearch() {
  const nav = useNavigate();
  const [kw, setKw] = React.useState('');
  const [open, setOpen] = React.useState(false);

  const results = React.useMemo(() => {
    const k = kw.trim();
    if (!k) return [];
    const db = dbLoad();
    const customers = (db.customers || []).filter((c) => c.name.includes(k)).slice(0, 5).map((c) => ({ type: '客户', label: c.name, to: `${ROUTES.CUSTOMERS}/${c.id}` }));
    const products = (db.products || []).filter((p) => p.name.includes(k)).slice(0, 5).map((p) => ({ type: '产品', label: p.name, to: ROUTES.INVENTORY }));
    const orders = (db.orders || []).filter((o) => o.id.includes(k)).slice(0, 5).map((o) => ({ type: '订单', label: o.id, to: ROUTES.ORDERS }));
    return [...customers, ...products, ...orders].slice(0, 8);
  }, [kw]);

  function go(r) {
    setOpen(false);
    setKw('');
    nav(r.to);
  }

  return (
    <div className="relative w-[520px]">
      <input
        className="ui-input"
        placeholder="全局快速搜索：客户 / 产品 / 订单…"
        value={kw}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onChange={(e) => setKw(e.target.value)}
      />
      {open && results.length > 0 ? (
        <div className="absolute left-0 right-0 top-[44px] z-50 ui-card p-2">
          {results.map((r, idx) => (
            <button
              key={`${r.type}_${idx}`}
              type="button"
              className="w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-950"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => go(r)}
            >
              <span className="mr-2 ui-badge ui-badge-warning">{r.type}</span>
              {r.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
