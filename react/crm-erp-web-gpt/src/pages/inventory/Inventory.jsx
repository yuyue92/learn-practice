import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { listProducts, upsertProduct } from '../../api/products.js';
import { useAuthStore } from '../../stores/authStore.js';
import { useTableState } from '../../hooks/useTableState.js';
import { useDebouncedValue } from '../../hooks/useDebouncedValue.js';
import Table from '../../components/ui/Table.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import Button from '../../components/ui/Button.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Input from '../../components/ui/Input.jsx';
import { useToast } from '../../components/ui/Toast.jsx';

export default function Inventory() {
  const toast = useToast();
  const user = useAuthStore((s) => s.user);

  const table = useTableState({ pageSize: 10 });
  const dq = useDebouncedValue(table.keyword, 250);

  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({ id: '', name: '', category: '', price: 0, cost: 0, stock: 0, warnThreshold: 0 });

  const q = useQuery({
    queryKey: ['products', table.page, table.pageSize, dq],
    queryFn: () => listProducts({ page: table.page, pageSize: table.pageSize, keyword: dq })
  });

  const saveMut = useMutation({
    mutationFn: (v) => upsertProduct(v, { userId: user.id }),
    onSuccess: () => { toast.push({ title: '保存成功' }); setOpen(false); q.refetch(); },
    onError: (e) => toast.push({ title: '失败', message: e.message })
  });

  const cols = [
    { key: 'name', title: '产品名称' },
    { key: 'category', title: '分类' },
    { key: 'price', title: '单价' },
    { key: 'cost', title: '成本' },
    { key: 'stock', title: '库存' },
    { key: 'warnThreshold', title: '预警阈值' }
  ];

  function openCreate() {
    setForm({ id: '', name: '', category: '', price: 0, cost: 0, stock: 0, warnThreshold: 20 });
    setOpen(true);
  }

  function openEdit(r) {
    setForm({ ...r });
    setOpen(true);
  }

  function submit() {
    saveMut.mutate({
      ...form,
      price: Number(form.price || 0),
      cost: Number(form.cost || 0),
      stock: Number(form.stock || 0),
      warnThreshold: Number(form.warnThreshold || 0)
    });
  }

  return (
    <div className="space-y-4">
      <div className="ui-card p-4 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold">产品与库存</div>
          <div className="mt-1 text-xs text-slate-500">产品信息管理 / 库存预警（演示）</div>
        </div>
        <Button onClick={openCreate}>新增产品</Button>
      </div>

      <div className="ui-card p-4 flex items-center justify-between">
        <input className="ui-input w-[360px]" placeholder="搜索产品/分类…" value={table.keyword} onChange={(e) => table.setKeyword(e.target.value)} />
        <Button variant="ghost" onClick={() => q.refetch()} disabled={q.isFetching}>{q.isFetching ? '刷新中…' : '刷新'}</Button>
      </div>

      <div className="ui-card p-4 space-y-3">
        <Table columns={cols} rows={q.data?.list || []} actionsRender={(r) => (
          <div className="flex justify-end">
            <Button variant="ghost" onClick={() => openEdit(r)}>编辑</Button>
          </div>
        )} />
        <Pagination page={table.page} pageSize={table.pageSize} total={q.data?.total || 0} onChange={table.setPage} />
      </div>

      <Modal open={open} title={form.id ? '编辑产品' : '新增产品'} onClose={() => setOpen(false)} footer={null}>
        <div className="grid grid-cols-2 gap-4">
          <Input label="名称" value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} />
          <Input label="分类" value={form.category} onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))} />
          <Input label="单价" type="number" value={form.price} onChange={(e) => setForm((s) => ({ ...s, price: e.target.value }))} />
          <Input label="成本" type="number" value={form.cost} onChange={(e) => setForm((s) => ({ ...s, cost: e.target.value }))} />
          <Input label="库存" type="number" value={form.stock} onChange={(e) => setForm((s) => ({ ...s, stock: e.target.value }))} />
          <Input label="预警阈值" type="number" value={form.warnThreshold} onChange={(e) => setForm((s) => ({ ...s, warnThreshold: e.target.value }))} />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setOpen(false)}>取消</Button>
          <Button onClick={submit} disabled={saveMut.isPending}>{saveMut.isPending ? '保存中…' : '保存'}</Button>
        </div>
      </Modal>
    </div>
  );
}
