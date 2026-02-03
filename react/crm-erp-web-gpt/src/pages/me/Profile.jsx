import React from 'react';
import { useAuthStore } from '../../stores/authStore.js';
import { useUiStore } from '../../stores/uiStore.js';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Table from '../../components/ui/Table.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import { dbLoad, dbSave } from '../../api/mockDb.js';
import { fmtDateTime } from '../../utils/format.js';
import { useToast } from '../../components/ui/Toast.jsx';

export default function Profile() {
  const toast = useToast();
  const user = useAuthStore((s) => s.user);
  const theme = useUiStore((s) => s.theme);
  const setTheme = useUiStore((s) => s.setTheme);

  const [name, setName] = React.useState(user?.name || '');
  const [phone, setPhone] = React.useState(user?.phone || '');
  const [page, setPage] = React.useState(1);

  const db = dbLoad();
  const myLogsAll = (db.logs || []).filter((l) => l.userId === user.id);
  const pageSize = 12;
  const total = myLogsAll.length;
  const list = myLogsAll.slice((page - 1) * pageSize, page * pageSize);

  const cols = [
    { key: 'time', title: '时间', render: (r) => fmtDateTime(r.time) },
    { key: 'module', title: '模块' },
    { key: 'action', title: '动作' },
    { key: 'detail', title: '详情' }
  ];

  function saveProfile() {
    const next = structuredClone(db);
    const u = next.users.find((x) => x.id === user.id);
    if (u) {
      u.name = name.trim() || u.name;
      u.phone = phone.trim() || u.phone;
      dbSave(next);
      useAuthStore.setState({ user: u });
      toast.push({ title: '已保存个人信息' });
    }
  }

  return (
    <div className="space-y-4">
      <div className="ui-card p-4">
        <div className="text-sm font-semibold">个人中心</div>
        <div className="mt-1 text-xs text-slate-500">个人信息 / 主题偏好 / 我的操作日志</div>

        <div className="mt-4 grid grid-cols-3 gap-4">
          <Input label="姓名" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="电话" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <div className="space-y-1">
            <div className="ui-label">主题</div>
            <div className="flex items-center gap-2">
              <Button variant={theme === 'light' ? 'primary' : 'ghost'} onClick={() => setTheme('light')}>亮色</Button>
              <Button variant={theme === 'dark' ? 'primary' : 'ghost'} onClick={() => setTheme('dark')}>暗黑</Button>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button onClick={saveProfile}>保存</Button>
        </div>
      </div>

      <div className="ui-card p-4 space-y-3">
        <div className="text-sm font-semibold">我的操作日志</div>
        <Table columns={cols} rows={list} />
        <Pagination page={page} pageSize={pageSize} total={total} onChange={setPage} />
      </div>
    </div>
  );
}
