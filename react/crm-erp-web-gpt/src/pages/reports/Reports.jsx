import React from 'react';
import { dbLoad, dbSave } from '../../api/mockDb.js';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, BarChart, Bar } from 'recharts';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Modal from '../../components/ui/Modal.jsx';
import ChartExportButton from '../../components/charts/ChartExportButton.jsx';
import { exportJson, exportCsv } from '../../utils/export.js';
import { fmtMoney } from '../../utils/format.js';
import { uid } from '../../utils/id.js';

export default function Reports() {
  const [db, setDb] = React.useState(() => dbLoad());
  const [tplOpen, setTplOpen] = React.useState(false);
  const [tplName, setTplName] = React.useState('');
  const [rangeStart, setRangeStart] = React.useState('');
  const [rangeEnd, setRangeEnd] = React.useState('');

  const templates = db.reportTemplates || [];
  const chartRoot1 = React.useRef(null);
  const chartRoot2 = React.useRef(null);
  const chartRoot3 = React.useRef(null);

  const orders = db.orders || [];
  const products = db.products || [];
  const customers = db.customers || [];

  const salesTrend = React.useMemo(() => {
    const map = new Map();
    for (const o of orders) {
      const d = String(o.createdAt || '').slice(0, 10) || 'unknown';
      map.set(d, (map.get(d) || 0) + Number(o.amount || 0));
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, value]) => ({ date, value }));
  }, [orders]);

  const customerDist = React.useMemo(() => {
    const m = new Map();
    for (const c of customers) {
      const k = c.level || 'UNKNOWN';
      m.set(k, (m.get(k) || 0) + 1);
    }
    return Array.from(m.entries()).map(([name, value]) => ({ name, value }));
  }, [customers]);

  const stockByCategory = React.useMemo(() => {
    const m = new Map();
    for (const p of products) {
      const k = p.category || '其他';
      m.set(k, (m.get(k) || 0) + Number(p.stock || 0));
    }
    return Array.from(m.entries()).map(([name, value]) => ({ name, value }));
  }, [products]);

  const kpis = React.useMemo(() => {
    const salesTotal = orders.reduce((s, o) => s + Number(o.amount || 0), 0);
    const stockTotal = products.reduce((s, p) => s + Number(p.stock || 0), 0);
    const warnCount = products.filter((p) => Number(p.stock) < Number(p.warnThreshold || 0)).length;
    return { customers: customers.length, salesTotal, stockTotal, warnCount };
  }, [orders, products, customers]);

  function reloadDb() { setDb(dbLoad()); }

  function saveTemplate() {
    const name = tplName.trim();
    if (!name) return;
    const next = structuredClone(db);
    next.reportTemplates = next.reportTemplates || [];
    next.reportTemplates.unshift({ id: uid('rt'), name, createdAt: new Date().toISOString(), filters: { rangeStart, rangeEnd } });
    dbSave(next);
    setDb(next);
    setTplName('');
    setTplOpen(false);
  }

  function applyTemplate(t) {
    setRangeStart(t.filters?.rangeStart || '');
    setRangeEnd(t.filters?.rangeEnd || '');
  }

  function exportBackup() {
    exportJson(`backup_${new Date().toISOString().slice(0, 10)}.json`, {
      customers: db.customers, followups: db.followups, products: db.products, suppliers: db.suppliers,
      orders: db.orders, purchases: db.purchases, stockMoves: db.stockMoves, config: db.config
    });
  }

  function restoreBackup(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result || '{}'));
        const next = structuredClone(db);
        next.customers = data.customers || [];
        next.followups = data.followups || [];
        next.products = data.products || [];
        next.suppliers = data.suppliers || [];
        next.orders = data.orders || [];
        next.purchases = data.purchases || [];
        next.stockMoves = data.stockMoves || [];
        next.config = data.config || next.config;
        dbSave(next);
        setDb(next);
        alert('恢复成功（前端演示）');
      } catch (e) {
        alert(`恢复失败：${e.message}`);
      }
    };
    reader.readAsText(file);
  }

  function exportSalesCsv() {
    const rows = (db.orders || []).map((o) => ({
      id: o.id, customerId: o.customerId, status: o.status, amount: o.amount, createdAt: o.createdAt
    }));
    exportCsv('sales_report.csv', rows);
  }

  return (
    <div className="space-y-4">
      <div className="ui-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">数据统计与报表</div>
            <div className="mt-1 text-xs text-slate-500">图表导出 PNG / 报表导出 CSV / 模板保存 / 数据备份恢复（前端演示）</div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => setTplOpen(true)}>保存模板</Button>
            <Button variant="ghost" onClick={exportSalesCsv}>导出销售 CSV</Button>
            <Button variant="ghost" onClick={exportBackup}>备份数据 JSON</Button>
            <label className="ui-btn ui-btn-ghost cursor-pointer">
              恢复备份
              <input className="hidden" type="file" accept="application/json" onChange={(e) => restoreBackup(e.target.files?.[0])} />
            </label>
            <Button variant="ghost" onClick={reloadDb}>刷新</Button>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-4 gap-3">
          <div className="rounded-2xl border border-slate-200/60 p-3 dark:border-slate-800">
            <div className="text-xs text-slate-500">客户总数</div>
            <div className="mt-1 text-xl font-semibold">{kpis.customers}</div>
          </div>
          <div className="rounded-2xl border border-slate-200/60 p-3 dark:border-slate-800">
            <div className="text-xs text-slate-500">销售总额</div>
            <div className="mt-1 text-xl font-semibold">{fmtMoney(kpis.salesTotal)}</div>
          </div>
          <div className="rounded-2xl border border-slate-200/60 p-3 dark:border-slate-800">
            <div className="text-xs text-slate-500">库存总量</div>
            <div className="mt-1 text-xl font-semibold">{kpis.stockTotal}</div>
          </div>
          <div className="rounded-2xl border border-slate-200/60 p-3 dark:border-slate-800">
            <div className="text-xs text-slate-500">库存预警</div>
            <div className="mt-1 text-xl font-semibold">{kpis.warnCount}</div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <Input label="时间范围（开始）" value={rangeStart} onChange={(e) => setRangeStart(e.target.value)} placeholder="yyyy-mm-dd（演示）" />
          <Input label="时间范围（结束）" value={rangeEnd} onChange={(e) => setRangeEnd(e.target.value)} placeholder="yyyy-mm-dd（演示）" />
          <div className="space-y-1">
            <div className="ui-label">模板</div>
            <select className="ui-input" onChange={(e) => {
              const t = templates.find((x) => x.id === e.target.value);
              if (t) applyTemplate(t);
            }}>
              <option value="">选择模板快速套用</option>
              {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="ui-card p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">销售趋势（按日）</div>
          <ChartExportButton chartRootRef={chartRoot1} filename="sales_trend.png" />
        </div>
        <div ref={chartRoot1} className="mt-3 h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesTrend}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="ui-card p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">客户阶段分布</div>
            <ChartExportButton chartRootRef={chartRoot2} filename="customer_distribution.png" />
          </div>
          <div ref={chartRoot2} className="mt-3 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={customerDist} dataKey="value" nameKey="name" label />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="ui-card p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">库存分布（按分类）</div>
            <ChartExportButton chartRootRef={chartRoot3} filename="stock_by_category.png" />
          </div>
          <div ref={chartRoot3} className="mt-3 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockByCategory}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <Modal open={tplOpen} title="保存报表模板" onClose={() => setTplOpen(false)} footer={null}>
        <div className="space-y-4">
          <Input label="模板名称" value={tplName} onChange={(e) => setTplName(e.target.value)} placeholder="例如：销售部-月报" />
          <div className="text-xs text-slate-500">将保存当前筛选项：rangeStart / rangeEnd（演示）。</div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setTplOpen(false)}>取消</Button>
            <Button onClick={saveTemplate}>保存</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
