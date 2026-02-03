import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore.js';
import { ROUTES } from '../../constants/routes.js';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import { useToast } from '../../components/ui/Toast.jsx';

export default function Login() {
  const nav = useNavigate();
  const toast = useToast();
  const login = useAuthStore((s) => s.login);

  const [username, setUsername] = React.useState('admin');
  const [password, setPassword] = React.useState('1');
  const [remember, setRemember] = React.useState(true);
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ username, password, remember });
      toast.push({ title: '登录成功' });
      nav(ROUTES.HOME);
    } catch (err) {
      toast.push({ title: '登录失败', message: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 dark:bg-slate-950">
      <div className="ui-card w-[520px] p-6">
        <div className="text-xl font-semibold">企业级 CRM/ERP Web</div>
        <div className="mt-2 text-sm text-slate-500">内网部署版本（演示：本地 mock 数据）</div>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <Input label="账号" value={username} onChange={(e) => setUsername(e.target.value)} autoFocus />
          <Input label="密码" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            记住登录（可配置有效期）
          </label>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? '登录中…' : '登录'}
          </Button>
        </form>

        <div className="mt-4 text-xs text-slate-500">
          演示账号：admin / director / sales1 / warehouse / purchase / finance（密码任意非空）
        </div>
      </div>
    </div>
  );
}
