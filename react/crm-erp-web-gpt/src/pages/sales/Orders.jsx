import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { listOrders, upsertOrder } from '../../api/orders.js';
import { useAuthStore } from '../../stores/authStore.js';
import { useTableState } from '../../hooks/useTableState.js';
import { useDebouncedValue } from '../../hooks/useDebouncedValue.js';
import Table from '../../components/ui/Table.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import Button from '../../components/ui/Button.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Input from '../../components/ui/Input.jsx';
import Select from '../../components/ui/Select.jsx';
import { useToast } from '../../components/ui/Toast.jsx';
import { fmtDateTime, fmtMoney } from '../../utils/format.js';
import { dbLoad } from '../../api/mockDb.js';

const STATUS = ['DRAFT', 'APPROVED', 'UNPAID', 'PAID', 'SHIPPED', 'DONE', 'CANCELED'];

export default function Orders() {
  const toast = useToast();
  const user = useAuthStore((s) => s.user);

  const table = useTableState({ pageSize: 10 });
  const dq = useDebouncedValue(table.keyword, 250);

  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({ id: '', customerId: '', status: 'DRAFT', amount: 0 });

  const q = useQuery({
    queryKey: ['orders', table.page, table.pageSize, dq, user?.id, user?.role],
    queryFn: () => listOrders({ page: table.page, pageSize: table.pageSize, keyword: dq, user })
  });

  const saveMut = useMutation({
    mutationFn: (v) => upsertOrder(v, { userId: user.id }),
    onSuccess: () => { toast.push({ title: '保存成功' }); setOpen(false); q.refetch(); },
    onError: (e) => toast.push({ title: '失败', message: e.message })
  });

  const cols = [
    { key: 'id', title: '订单号' },
    { key: 'customerId', title: '客户' },
    { key: 'status', title: '状态' },
    { key: 'amount', title: '金额', render: (r) => fmtMoney(r.amount) },
    { key: 'createdAt', title: '创建时间', render: (r) => fmtDateTime(r.createdAt) }
  ];

  const customers = (dbLoad().customers || []);

  function openCreate() {
    setForm({ id: '', customerId: customers[0]?.id || '', status: 'DRAFT', amount: 0, ownerId: user.id });
    setOpen(true);
  }

  function openEdit(r) {
    setForm({ ...r });
    setOpen(true);
  }

  function submit() {
    saveMut.mutate({ ...form, amount: Number(form.amount || 0), ownerId: form.ownerId || user.id });
  }

  return (
    <div className="space-y-4">
      <div className="ui-card p-4 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold">销售订单</div>
          <div className="mt-1 text-xs text-slate-500">状态流转（演示）/ 订单列表（销售数据级鉴权）</div>
        </div>
        <Button onClick={openCreate}>新建订单</Button>
      </div>

      <div className="ui-card p-4 flex items-center justify-between">
        <input className="ui-input w-[360px]" placeholder="搜索订单号/状态…" value={table.keyword} onChange={(e) => table.setKeyword(e.target.value)} />
        <Button variant="ghost" onClick={() => q.refetch()} disabled={q.isFetching}>{q.isFetching ? '刷新中…' : '刷新'}</Button>
      </div>

      <div className="ui-card p-4 space-y-3">
        <Table columns={cols} rows={q.data?.list || []} actionsRender={(r) => (
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => openEdit(r)}>编辑</Button>
          </div>
        )} />
        <Pagination page={table.page} pageSize={table.pageSize} total={q.data?.total || 0} onChange={table.setPage} />
      </div>

      <Modal open={open} title={form.id ? '编辑订单' : '新建订单'} onClose={() => setOpen(false)} footer={null}>
        <div className="grid grid-cols-2 gap-4">
          <Select label="客户" value={form.customerId} onChange={(e) => setForm((s) => ({ ...s, customerId: e.target.value }))}>
            {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
          <Select label="状态" value={form.status} onChange={(e) => setForm((s) => ({ ...s, status: e.target.value }))}>
            {STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
          <Input label="金额" type="number" value={form.amount} onChange={(e) => setForm((s) => ({ ...s, amount: e.target.value }))} />
          <Input label="负责人（演示）" value={form.ownerId || user.id} onChange={(e) => setForm((s) => ({ ...s, ownerId: e.target.value }))} />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setOpen(false)}>取消</Button>
          <Button onClick={submit} disabled={saveMut.isPending}>{saveMut.isPending ? '保存中…' : '保存'}</Button>
        </div>
      </Modal>
    </div>
  );
}
