/**
 * 登录页面
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    remember: false,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 模拟登录请求 (实际项目中应调用 API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟登录成功
      const mockUser = {
        id: '1',
        username: formData.username,
        realName: '测试用户',
        email: 'test@example.com',
        roleCode: 'admin',
        roleName: '超级管理员',
      };
      
      const mockToken = 'mock-token-' + Date.now();
      
      login(mockUser, mockToken);
      
      // 跳转到首页
      navigate('/app/dashboard');
    } catch (err) {
      setError(err.message || '登录失败,请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-neutral-900 dark:to-neutral-800">
      <div className="w-full max-w-md">
        <div className="card p-8">
          {/* Logo 和标题 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
              企业级 CRM/ERP 系统
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              欢迎登录
            </p>
          </div>

          {/* 登录表单 */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 错误提示 */}
            {error && (
              <div className="p-3 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg text-danger-600 dark:text-danger-400 text-sm">
                {error}
              </div>
            )}

            {/* 用户名 */}
            <div>
              <label className="form-label">
                用户名<span className="required-mark">*</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="input"
                placeholder="请输入用户名"
                required
                autoFocus
              />
            </div>

            {/* 密码 */}
            <div>
              <label className="form-label">
                密码<span className="required-mark">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input"
                placeholder="请输入密码"
                required
              />
            </div>

            {/* 记住密码 */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-neutral-700 dark:text-neutral-300">
                  记住密码
                </span>
              </label>
            </div>

            {/* 登录按钮 */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </form>

          {/* 测试账号提示 */}
          <div className="mt-6 p-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg">
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">测试账号:</p>
            <div className="text-xs text-neutral-500 dark:text-neutral-500 space-y-1">
              <p>管理员: admin / admin123</p>
              <p>销售: sales / 123456</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
