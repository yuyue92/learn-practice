import React from 'react';
import { dbLoad } from '../../api/mockDb.js';
import Table from '../../components/ui/Table.jsx';
import { fmtMoney, fmtDateTime } from '../../utils/format.js';

export default function Finance() {
  const db = dbLoad();
  const orders = db.orders || [];

  const cols = [
    { key: 'id', title: '订单号' },
    { key: 'customerId', title: '客户' },
    { key: 'status', title: '状态' },
    { key: 'amount', title: '金额', render: (r) => fmtMoney(r.amount) },
    { key: 'createdAt', title: '创建时间', render: (r) => fmtDateTime(r.createdAt) }
  ];

  return (
    <div className="space-y-4">
      <div className="ui-card p-4">
        <div className="text-sm font-semibold">财务与回款（演示）</div>
        <div className="mt-1 text-xs text-slate-500">回款登记 / 逾期提醒 / 报表导出（此版本提供基础视图，后续可扩展）</div>
      </div>
      <div className="ui-card p-4">
        <Table columns={cols} rows={orders} />
      </div>
    </div>
  );
}
