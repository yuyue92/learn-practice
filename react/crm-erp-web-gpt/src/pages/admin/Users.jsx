import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { listUsers, upsertUser, toggleUser } from '../../api/admin.js';
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
import { ROLES, ROLE_LABEL } from '../../constants/roles.js';

export default function Users() {
  const toast = useToast();
  const user = useAuthStore((s) => s.user);

  const table = useTableState({ pageSize: 10 });
  const dq = useDebouncedValue(table.keyword, 250);

  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({ id: '', username: '', name: '', role: ROLES.EMPLOYEE, phone: '', status: 'ACTIVE' });

  const q = useQuery({
    queryKey: ['users', table.page, table.pageSize, dq],
    queryFn: () => listUsers({ page: table.page, pageSize: table.pageSize, keyword: dq })
  });

  const saveMut = useMutation({
    mutationFn: (v) => upsertUser(v, { userId: user.id }),
    onSuccess: () => { toast.push({ title: '保存成功' }); setOpen(false); q.refetch(); },
    onError: (e) => toast.push({ title: '失败', message: e.message })
  });

  const toggleMut = useMutation({
    mutationFn: ({ id, status }) => toggleUser(id, status, { userId: user.id }),
    onSuccess: () => { toast.push({ title: '已更新状态' }); q.refetch(); },
    onError: (e) => toast.push({ title: '失败', message: e.message })
  });

  const cols = [
    { key: 'username', title: '账号' },
    { key: 'name', title: '姓名' },
    { key: 'role', title: '角色', render: (r) => ROLE_LABEL[r.role] || r.role },
    { key: 'phone', title: '电话' },
    { key: 'status', title: '状态', render: (r) => r.status === 'ACTIVE' ? <span className="ui-badge ui-badge-success">启用</span> : <span className="ui-badge ui-badge-danger">禁用</span> }
  ];

  function openCreate() {
    setForm({ id: '', username: '', name: '', role: ROLES.EMPLOYEE, phone: '', status: 'ACTIVE' });
    setOpen(true);
  }

  function openEdit(r) {
    setForm({ ...r });
    setOpen(true);
  }

  function submit() {
    if (!form.username.trim()) return toast.push({ title: '请输入账号' });
    if (!form.name.trim()) return toast.push({ title: '请输入姓名' });
    saveMut.mutate({ ...form, username: form.username.trim(), name: form.name.trim() });
  }

  return (
    <div className="space-y-4">
      <div className="ui-card p-4 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold">用户与权限（仅超级管理员）</div>
          <div className="mt-1 text-xs text-slate-500">账号增删改查 / 角色分配 / 启用禁用（演示）</div>
        </div>
        <Button onClick={openCreate}>新增用户</Button>
      </div>

      <div className="ui-card p-4 flex items-center justify-between">
        <input className="ui-input w-[360px]" placeholder="搜索账号/姓名…" value={table.keyword} onChange={(e) => table.setKeyword(e.target.value)} />
        <Button variant="ghost" onClick={() => q.refetch()} disabled={q.isFetching}>{q.isFetching ? '刷新中…' : '刷新'}</Button>
      </div>

      <div className="ui-card p-4 space-y-3">
        <Table columns={cols} rows={q.data?.list || []} actionsRender={(r) => (
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => openEdit(r)}>编辑</Button>
            <Button
              variant={r.status === 'ACTIVE' ? 'danger' : 'primary'}
              onClick={() => toggleMut.mutate({ id: r.id, status: r.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE' })}
              disabled={toggleMut.isPending}
            >
              {r.status === 'ACTIVE' ? '禁用' : '启用'}
            </Button>
          </div>
        )} />
        <Pagination page={table.page} pageSize={table.pageSize} total={q.data?.total || 0} onChange={table.setPage} />
      </div>

      <Modal open={open} title={form.id ? '编辑用户' : '新增用户'} onClose={() => setOpen(false)} footer={null}>
        <div className="grid grid-cols-2 gap-4">
          <Input label="账号" value={form.username} onChange={(e) => setForm((s) => ({ ...s, username: e.target.value }))} disabled={Boolean(form.id)} />
          <Input label="姓名" value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} />
          <Select label="角色" value={form.role} onChange={(e) => setForm((s) => ({ ...s, role: e.target.value }))}>
            {Object.values(ROLES).map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
          </Select>
          <Input label="电话" value={form.phone} onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))} />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setOpen(false)}>取消</Button>
          <Button onClick={submit} disabled={saveMut.isPending}>{saveMut.isPending ? '保存中…' : '保存'}</Button>
        </div>
      </Modal>
    </div>
  );
}
