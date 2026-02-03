import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { listCustomers, upsertCustomer, deleteCustomer } from '../../api/customers.js';
import { useAuthStore } from '../../stores/authStore.js';
import { useTableState } from '../../hooks/useTableState.js';
import { useDebouncedValue } from '../../hooks/useDebouncedValue.js';
import Table from '../../components/ui/Table.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import Button from '../../components/ui/Button.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Input from '../../components/ui/Input.jsx';
import { useToast } from '../../components/ui/Toast.jsx';
import { Link } from 'react-router-dom';
import { maskPhone } from '../../utils/format.js';
import { usePermission } from '../../hooks/usePermission.js';
import { FEATURES } from '../../permissions/rolePerms.js';

export default function Customers() {
  const toast = useToast();
  const user = useAuthStore((s) => s.user);
  const { can } = usePermission();

  const table = useTableState({ pageSize: 10 });
  const dq = useDebouncedValue(table.keyword, 250);

  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({ id: '', name: '', phone: '', level: '潜在客户', tags: '', ownerId: user.id });

  const q = useQuery({
    queryKey: ['customers', table.page, table.pageSize, dq, user?.id, user?.role],
    queryFn: () => listCustomers({ page: table.page, pageSize: table.pageSize, keyword: dq, user })
  });

  const saveMut = useMutation({
    mutationFn: (v) => upsertCustomer(v, { userId: user.id }),
    onSuccess: () => { toast.push({ title: '保存成功' }); setOpen(false); q.refetch(); },
    onError: (e) => toast.push({ title: '失败', message: e.message })
  });

  const delMut = useMutation({
    mutationFn: (id) => deleteCustomer(id, { userId: user.id }),
    onSuccess: () => { toast.push({ title: '删除成功' }); q.refetch(); },
    onError: (e) => toast.push({ title: '失败', message: e.message })
  });

  const cols = [
    { key: 'name', title: '客户名称', render: (r) => <Link className="text-brand-600 hover:underline" to={`/customers/${r.id}`}>{r.name}</Link> },
    { key: 'level', title: '阶段' },
    { key: 'phone', title: '电话（脱敏）', render: (r) => maskPhone(r.phone) },
    { key: 'tags', title: '标签', render: (r) => (r.tags || []).join(', ') },
    { key: 'ownerId', title: '负责人' }
  ];

  function openCreate() {
    setForm({ id: '', name: '', phone: '', level: '潜在客户', tags: '', ownerId: user.id });
    setOpen(true);
  }

  function openEdit(r) {
    setForm({ ...r, tags: (r.tags || []).join(', ') });
    setOpen(true);
  }

  function submit() {
    const payload = { ...form, tags: String(form.tags || '').split(',').map((x) => x.trim()).filter(Boolean) };
    saveMut.mutate(payload);
  }

  return (
    <div className="space-y-4">
      <div className="ui-card p-4 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold">客户管理</div>
          <div className="mt-1 text-xs text-slate-500">增删改查 / 详情页标签 / 跟进记录（数据级鉴权：销售仅看自己）</div>
        </div>
        <Button onClick={openCreate}>新增客户</Button>
      </div>

      <div className="ui-card p-4 flex items-center justify-between">
        <input className="ui-input w-[360px]" placeholder="搜索客户名/电话…" value={table.keyword} onChange={(e) => table.setKeyword(e.target.value)} />
        <Button variant="ghost" onClick={() => q.refetch()} disabled={q.isFetching}>{q.isFetching ? '刷新中…' : '刷新'}</Button>
      </div>

      <div className="ui-card p-4 space-y-3">
        <Table
          columns={cols}
          rows={q.data?.list || []}
          actionsRender={(r) => (
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => openEdit(r)}>编辑</Button>
              {can(FEATURES.CUSTOMER_DELETE) ? (
                <Button variant="danger" onClick={() => delMut.mutate(r.id)} disabled={delMut.isPending}>删除</Button>
              ) : (
                <Button variant="ghost" disabled>无删除权限</Button>
              )}
            </div>
          )}
        />
        <Pagination page={table.page} pageSize={table.pageSize} total={q.data?.total || 0} onChange={table.setPage} />
      </div>

      <Modal open={open} title={form.id ? '编辑客户' : '新增客户'} onClose={() => setOpen(false)} footer={null}>
        <div className="grid grid-cols-2 gap-4">
          <Input label="客户名称" value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} />
          <Input label="电话" value={form.phone} onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))} />
          <Input label="阶段（潜在/意向/成交/流失）" value={form.level} onChange={(e) => setForm((s) => ({ ...s, level: e.target.value }))} />
          <Input label="标签（逗号分隔）" value={form.tags} onChange={(e) => setForm((s) => ({ ...s, tags: e.target.value }))} />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setOpen(false)}>取消</Button>
          <Button onClick={submit} disabled={saveMut.isPending}>{saveMut.isPending ? '保存中…' : '保存'}</Button>
        </div>
      </Modal>
    </div>
  );
}
