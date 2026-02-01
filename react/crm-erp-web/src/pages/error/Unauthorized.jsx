/**
 * 403 无权限页面
 */

import { useNavigate } from 'react-router-dom';

function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
      <div className="text-center p-8">
        <div className="text-8xl mb-4">🚫</div>
        <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
          403
        </h1>
        <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-8">
          抱歉,您没有权限访问此页面
        </p>
        <button
          onClick={() => navigate('/app/dashboard')}
          className="btn btn-primary"
        >
          返回首页
        </button>
      </div>
    </div>
  );
}

export default Unauthorized;
