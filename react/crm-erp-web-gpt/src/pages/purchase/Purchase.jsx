import React from 'react';
import { dbLoad } from '../../api/mockDb.js';
import Table from '../../components/ui/Table.jsx';
import { fmtDateTime } from '../../utils/format.js';

export default function Purchase() {
  const db = dbLoad();
  const purchases = db.purchases || [];

  const cols = [
    { key: 'id', title: '采购单号' },
    { key: 'supplierId', title: '供应商' },
    { key: 'status', title: '状态' },
    { key: 'createdAt', title: '创建时间', render: (r) => fmtDateTime(r.createdAt) },
    { key: 'items', title: '明细', render: (r) => (r.items || []).map((i) => `${i.productId} x${i.qty}`).join('；') }
  ];

  return (
    <div className="space-y-4">
      <div className="ui-card p-4">
        <div className="text-sm font-semibold">采购管理（演示）</div>
        <div className="mt-1 text-xs text-slate-500">采购订单 / 到货确认 / 入库（前端 mock 数据示意，后续可对接后端）</div>
      </div>
      <div className="ui-card p-4">
        <Table columns={cols} rows={purchases} />
      </div>
    </div>
  );
}
