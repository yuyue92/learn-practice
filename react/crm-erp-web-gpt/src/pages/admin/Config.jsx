import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getConfig, saveConfig, listLogs } from '../../api/admin.js';
import { useAuthStore } from '../../stores/authStore.js';
import { useToast } from '../../components/ui/Toast.jsx';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Table from '../../components/ui/Table.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import { fmtDateTime } from '../../utils/format.js';
import { exportCsv } from '../../utils/export.js';

export default function Config() {
  const toast = useToast();
  const user = useAuthStore((s) => s.user);

  const cfgQ = useQuery({ queryKey: ['config'], queryFn: getConfig });
  const [companyName, setCompanyName] = React.useState('');
  const [systemTitle, setSystemTitle] = React.useState('');
  const [defaultStockWarn, setDefaultStockWarn] = React.useState(20);

  React.useEffect(() => {
    if (cfgQ.data) {
      setCompanyName(cfgQ.data.companyName || '');
      setSystemTitle(cfgQ.data.systemTitle || '');
      setDefaultStockWarn(cfgQ.data.defaultStockWarn ?? 20);
    }
  }, [cfgQ.data]);

  const saveMut = useMutation({
    mutationFn: (v) => saveConfig(v, { userId: user.id }),
    onSuccess: () => { toast.push({ title: '已保存配置' }); cfgQ.refetch(); },
    onError: (e) => toast.push({ title: '失败', message: e.message })
  });

  const [page, setPage] = React.useState(1);
  const pageSize = 12;
  const logsQ = useQuery({ queryKey: ['logs', page], queryFn: () => listLogs({ page, pageSize }) });

  const cols = [
    { key: 'time', title: '时间', render: (r) => fmtDateTime(r.time) },
    { key: 'module', title: '模块' },
    { key: 'action', title: '动作' },
    { key: 'detail', title: '详情' },
    { key: 'userId', title: '用户' }
  ];

  function exportLogs() {
    exportCsv('system_logs.csv', logsQ.data?.list || []);
  }

  return (
    <div className="space-y-4">
      <div className="ui-card p-4">
        <div className="text-sm font-semibold">系统配置与日志（仅超级管理员）</div>
        <div className="mt-1 text-xs text-slate-500">全局参数实时生效（前端 mock）/ 系统日志查询与导出</div>
      </div>

      <div className="ui-card p-4 space-y-3">
        <div className="text-sm font-semibold">全局参数</div>
        <div className="grid grid-cols-3 gap-4">
          <Input label="公司名称" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          <Input label="系统标题" value={systemTitle} onChange={(e) => setSystemTitle(e.target.value)} />
          <Input label="库存预警默认阈值" type="number" value={defaultStockWarn} onChange={(e) => setDefaultStockWarn(e.target.value)} />
        </div>
        <div className="flex justify-end">
          <Button onClick={() => saveMut.mutate({ companyName, systemTitle, defaultStockWarn: Number(defaultStockWarn || 0) })} disabled={saveMut.isPending}>
            {saveMut.isPending ? '保存中…' : '保存'}
          </Button>
        </div>
      </div>

      <div className="ui-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">系统日志</div>
          <Button variant="ghost" onClick={exportLogs}>导出 CSV</Button>
        </div>
        <Table columns={cols} rows={logsQ.data?.list || []} />
        <Pagination page={page} pageSize={pageSize} total={logsQ.data?.total || 0} onChange={setPage} />
      </div>
    </div>
  );
}
