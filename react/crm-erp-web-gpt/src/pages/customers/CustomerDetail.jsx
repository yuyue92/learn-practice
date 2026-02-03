import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getCustomer, addFollowup } from '../../api/customers.js';
import { useAuthStore } from '../../stores/authStore.js';
import { useToast } from '../../components/ui/Toast.jsx';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Table from '../../components/ui/Table.jsx';
import { fmtDateTime, fmtMoney } from '../../utils/format.js';

export default function CustomerDetail() {
  const { id } = useParams();
  const user = useAuthStore((s) => s.user);
  const toast = useToast();
  const [tab, setTab] = React.useState('base');
  const [followup, setFollowup] = React.useState({ time: '', content: '', result: '', nextTime: '' });

  const q = useQuery({
    queryKey: ['customer', id, user?.id, user?.role],
    queryFn: () => getCustomer(id, user)
  });

  const addMut = useMutation({
    mutationFn: (v) => addFollowup(v, { userId: user.id }),
    onSuccess: () => { toast.push({ title: '已添加跟进' }); setFollowup({ time: '', content: '', result: '', nextTime: '' }); q.refetch(); },
    onError: (e) => toast.push({ title: '失败', message: e.message })
  });

  if (q.isLoading) return <div className="ui-card p-4">加载中…</div>;
  if (q.isError) return <div className="ui-card p-4 text-danger-700">{q.error.message}</div>;

  const c = q.data;

  const followCols = [
    { key: 'time', title: '时间', render: (r) => fmtDateTime(r.time) },
    { key: 'content', title: '内容' },
    { key: 'result', title: '结果' },
    { key: 'nextTime', title: '下次提醒', render: (r) => r.nextTime || '-' }
  ];

  const orderCols = [
    { key: 'id', title: '订单号' },
    { key: 'status', title: '状态' },
    { key: 'amount', title: '金额', render: (r) => fmtMoney(r.amount) },
    { key: 'createdAt', title: '创建时间', render: (r) => fmtDateTime(r.createdAt) }
  ];

  function submitFollowup() {
    if (!followup.content.trim()) return toast.push({ title: '请输入跟进内容' });
    addMut.mutate({ customerId: id, ownerId: user.id, ...followup, time: followup.time || new Date().toISOString() });
  }

  return (
    <div className="space-y-4">
      <div className="ui-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">{c.name}</div>
            <div className="mt-1 text-xs text-slate-500">阶段：{c.level} / 负责人：{c.ownerId}</div>
          </div>
          <div className="flex gap-2">
            <Button variant={tab === 'base' ? 'primary' : 'ghost'} onClick={() => setTab('base')}>基本信息</Button>
            <Button variant={tab === 'follow' ? 'primary' : 'ghost'} onClick={() => setTab('follow')}>跟进记录</Button>
            <Button variant={tab === 'orders' ? 'primary' : 'ghost'} onClick={() => setTab('orders')}>关联订单</Button>
          </div>
        </div>
      </div>

      {tab === 'base' ? (
        <div className="ui-card p-4 grid grid-cols-3 gap-3 text-sm">
          <div><div className="ui-label">电话</div><div className="mt-1">{c.phone}</div></div>
          <div><div className="ui-label">标签</div><div className="mt-1">{(c.tags || []).join(', ') || '-'}</div></div>
          <div><div className="ui-label">创建时间</div><div className="mt-1">{fmtDateTime(c.createdAt)}</div></div>
        </div>
      ) : null}

      {tab === 'follow' ? (
        <div className="ui-card p-4 space-y-3">
          <div className="text-sm font-semibold">新增跟进</div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="跟进时间（可空）" value={followup.time} onChange={(e) => setFollowup((s) => ({ ...s, time: e.target.value }))} placeholder="ISO/或留空" />
            <Input label="下次跟进提醒（可空）" value={followup.nextTime} onChange={(e) => setFollowup((s) => ({ ...s, nextTime: e.target.value }))} placeholder="yyyy-mm-dd（演示）" />
          </div>
          <Input label="跟进内容" value={followup.content} onChange={(e) => setFollowup((s) => ({ ...s, content: e.target.value }))} />
          <Input label="跟进结果" value={followup.result} onChange={(e) => setFollowup((s) => ({ ...s, result: e.target.value }))} />
          <div className="flex justify-end">
            <Button onClick={submitFollowup} disabled={addMut.isPending}>{addMut.isPending ? '提交中…' : '添加'}</Button>
          </div>

          <div className="pt-2">
            <Table columns={followCols} rows={c.followups || []} />
          </div>
        </div>
      ) : null}

      {tab === 'orders' ? (
        <div className="ui-card p-4">
          <Table columns={orderCols} rows={c.orders || []} />
        </div>
      ) : null}
    </div>
  );
}
