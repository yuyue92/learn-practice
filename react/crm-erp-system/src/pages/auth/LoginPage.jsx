/**
 * 登录页面
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import clsx from 'clsx';
import { HiOutlineUser, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff, HiOutlineMoon, HiOutlineSun } from 'react-icons/hi';
import { useUserStore, useThemeStore } from '@/stores';
import { ROUTES } from '@/constants/routes';
import { toast } from '@/utils/toast';

const loginSchema = z.object({
  username: z.string().min(1, '请输入用户名'),
  password: z.string().min(1, '请输入密码'),
  rememberMe: z.boolean().optional(),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoggedIn, loading, error, clearError } = useUserStore();
  const { mode, toggleTheme } = useThemeStore();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '', rememberMe: false },
  });

  useEffect(() => {
    if (isLoggedIn) navigate(ROUTES.DASHBOARD, { replace: true });
  }, [isLoggedIn, navigate]);

  useEffect(() => () => clearError(), [clearError]);

  const onSubmit = async (data) => {
    try {
      await login(data, data.rememberMe);
      toast.success('登录成功');
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (err) {
      toast.error(err.message || '登录失败');
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
              <span className="text-3xl font-bold">E</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">企业级CRM/ERP管理系统</h1>
            <p className="text-xl text-white/80">一体化办公解决方案，助力企业高效运营</p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-neutral-900 relative">
        <button className="absolute top-6 right-6 p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800" onClick={toggleTheme}>
          {mode === 'light' ? <HiOutlineMoon className="w-5 h-5" /> : <HiOutlineSun className="w-5 h-5" />}
        </button>

        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">欢迎回来</h2>
            <p className="text-neutral-500 dark:text-neutral-400 mt-2">请登录您的账号</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">用户名</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"><HiOutlineUser className="w-5 h-5" /></div>
                <input type="text" {...register('username')} className={clsx('w-full pl-10 pr-4 py-2.5 border rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500', errors.username ? 'border-danger-500' : 'border-neutral-300 dark:border-neutral-600')} placeholder="请输入用户名" />
              </div>
              {errors.username && <p className="text-sm text-danger-500 mt-1">{errors.username.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">密码</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"><HiOutlineLockClosed className="w-5 h-5" /></div>
                <input type={showPassword ? 'text' : 'password'} {...register('password')} className={clsx('w-full pl-10 pr-12 py-2.5 border rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500', errors.password ? 'border-danger-500' : 'border-neutral-300 dark:border-neutral-600')} placeholder="请输入密码" />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-danger-500 mt-1">{errors.password.message}</p>}
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('rememberMe')} className="w-4 h-4 text-primary-600 border-neutral-300 rounded" />
              <span className="text-sm text-neutral-600 dark:text-neutral-400">记住登录状态</span>
            </label>

            {error && <div className="p-3 bg-danger-50 text-danger-600 text-sm rounded-lg">{error}</div>}

            <button type="submit" disabled={loading} className="w-full py-2.5 rounded-lg font-medium bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? '登录中...' : '登 录'}
            </button>
          </form>

          <div className="mt-8 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg text-xs text-neutral-500">
            <p className="font-medium mb-2">测试账号</p>
            <p>超级管理员：admin / admin123</p>
            <p>销售员工：sales / 123456</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
